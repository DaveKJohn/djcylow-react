const nodemailer = require('nodemailer');

const RECEIVING_EMAIL = process.env.MAIL_USER;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Waar het formulier vandaan mag komen. Stond tot 2026-08-15 op '*', waardoor het endpoint
// bruikbaar was vanaf domeinen die niet van Dave zijn. De deploy-preview staat er bewust bij:
// elke PR krijgt er een, en die moet te testen zijn.
const TOEGESTANE_ORIGINS = [
    'https://djcylow.com',
    'https://www.djcylow.com',
    'https://djcylow-react.netlify.app',
];
const PREVIEW_ORIGIN = /^https:\/\/deploy-preview-\d+--djcylow-react\.netlify\.app$/;

// Dezelfde lijst, als hostname. Google geeft bij de verificatie terug op welk domein de
// challenge is opgelost; zonder die controle is een geldig token van elders ook geldig hier.
const TOEGESTANE_HOSTNAMES = [
    'djcylow.com',
    'www.djcylow.com',
    'djcylow-react.netlify.app',
];
const PREVIEW_HOSTNAME = /^deploy-preview-\d+--djcylow-react\.netlify\.app$/;

const MAX_LENGTE = { name: 100, email: 254, message: 5000 };

function isToegestaneOrigin(origin) {
    if (!origin) return false;
    return TOEGESTANE_ORIGINS.includes(origin) || PREVIEW_ORIGIN.test(origin);
}

function isToegestaneHostname(hostname) {
    if (!hostname) return false;
    return TOEGESTANE_HOSTNAMES.includes(hostname) || PREVIEW_HOSTNAME.test(hostname);
}

// Alleen echo-en na een match, nooit de binnenkomende waarde blind terugsturen.
function buildHeaders(origin) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        Vary: 'Origin',
    };
    if (isToegestaneOrigin(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return headers;
}

// Eén helper, zodat een volgend veld niet opnieuw vergeten wordt. De vier waarden gingen tot
// 2026-08-15 ongeescaped in een html:-template, waardoor de afzender bepaalde hoe de mail eruitzag.
function escapeHtml(waarde) {
    return String(waarde)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Bewust streng: alleen een string telt. Een JSON-body mag arrays en objecten leveren, en die
// belandden eerder ongecontroleerd in de mail en in replyTo.
function leesVeld(data, naam) {
    const waarde = data[naam];
    if (typeof waarde !== 'string') return null;
    const schoon = waarde.trim();
    if (!schoon) return null;
    if (schoon.length > MAX_LENGTE[naam]) return null;
    return schoon;
}

function isGeldigEmail(waarde) {
    // Bewust simpel: geen adresparser, alleen de vorm. De echte toets is of de reply aankomt.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(waarde);
}

/**
 * Netlify roept deze handler aan als handler(event, context). De derde parameter is er voor de
 * tests: de twee buitenwereld-afhankelijkheden (de HTTP-call naar Google en de mailtransport)
 * kunnen zo vervangen worden zonder aan de module-lader te sleutelen.
 *
 * Dat is bewust en niet uit gemak. Deze function is CommonJS en woont buiten src/, waardoor Vitest
 * haar met Node's eigen require laadt in plaats van door zijn transform. Gevolg: vi.mock greep
 * niet op haar require(), en zelfs vi.stubGlobal('fetch') werd niet gezien -- de module draait in
 * een andere context en hield de echte fetch. Elke test viel daardoor terug op een echte call naar
 * Google en liep in een timeout. Gemeten, niet aangenomen.
 */
exports.handler = async (event, _context, deps = {}) => {
    const doeFetch = deps.fetch || fetch;
    const maakTransport = deps.createTransport || nodemailer.createTransport;

    const origin = event.headers?.origin || event.headers?.Origin;
    const headers = buildHeaders(origin);

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode niet toegestaan.' }) };
    }

    try {
        let bodyContent = event.body;
        if (event.isBase64Encoded) {
            bodyContent = Buffer.from(bodyContent, 'base64').toString('utf-8');
        }

        let data;
        try {
            data = JSON.parse(bodyContent);
        } catch {
            // Geen JSON: dan is het een klassieke form-encoded body. De fout zelf zegt niets extra's,
            // dus die vangen we zonder binding op -- anders staat er een variabele die niemand leest.
            data = Object.fromEntries(new URLSearchParams(bodyContent));
        }

        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ongeldige aanvraag.' }) };
        }

        // Het formulier verstuurt één veld `name`. Tot 2026-08-15 las deze functie firstName en
        // lastName, die nergens in src/ bestaan -- elke aanvraag kwam binnen als
        // "Boekingsaanvraag: undefined undefined".
        const name = leesVeld(data, 'name');
        const email = leesVeld(data, 'email');
        const message = leesVeld(data, 'message');

        const ontbreekt = [];
        if (!name) ontbreekt.push('naam');
        if (!email) ontbreekt.push('e-mailadres');
        if (!message) ontbreekt.push('bericht');

        if (ontbreekt.length) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: `Vul het volgende in: ${ontbreekt.join(', ')}.` }),
            };
        }

        if (!isGeldigEmail(email)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Vul een geldig e-mailadres in.' }) };
        }

        const token = typeof data['g-recaptcha-response'] === 'string' ? data['g-recaptcha-response'] : '';
        if (!token) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA token ontbreekt.' }) };
        }

        // 1. VERIFIEER BIJ GOOGLE
        const recaptchaParams = new URLSearchParams();
        recaptchaParams.append('secret', RECAPTCHA_SECRET_KEY);
        recaptchaParams.append('response', token);

        // Met de ingebouwde fetch en niet met axios: het is één POST, Node levert fetch sinds v18,
        // en het scheelt een dependency die alleen hiervoor bestond.
        const verifyRes = await doeFetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: recaptchaParams.toString(),
        });
        const verify = await verifyRes.json();

        if (!verify.success) {
            console.error('Google weigerde verificatie:', verify['error-codes']);
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA verificatie mislukt.' }) };
        }

        // Google geeft terug waar de challenge is opgelost. Zonder deze controle is een token dat
        // elders is opgehaald hier net zo goed geldig.
        if (verify.hostname && !isToegestaneHostname(verify.hostname)) {
            console.error('reCAPTCHA opgelost op een onbekend domein:', verify.hostname);
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA verificatie mislukt.' }) };
        }

        // 2. VERSTUUR MAIL VIA HOSTINGER
        const transporter = maakTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10) || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"contact-formulier" <${process.env.MAIL_USER}>`,
            to: RECEIVING_EMAIL,
            replyTo: email,
            subject: `Boekingsaanvraag: ${name}`,
            text: `Nieuw bericht van djcylow.com\n\nNaam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}\n`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #333;">Nieuw bericht van djcylow.com</h2>
                    <p><strong>Naam:</strong> ${escapeHtml(name)}</p>
                    <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Bericht:</strong></p>
                    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('E-mail succesvol verzonden.');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Bericht succesvol verzonden!' }),
        };

    } catch (error) {
        console.error('--- FOUT IN FUNCTIE ---');
        console.error('Type:', error.name);
        console.error('Boodschap:', error.message);

        // Headers zijn ook hier nodig: zonder blokkeert de browser de response en ziet de
        // frontend geen foutstatus. De details blijven in de Netlify-logs -- een SMTP- of
        // DNS-fout noemt infrastructuur, en de frontend leest dit veld niet eens.
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Er is iets misgegaan bij het verwerken van je aanvraag.',
            }),
        };
    }
};
