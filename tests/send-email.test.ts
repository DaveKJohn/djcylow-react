import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests voor de Netlify-function `netlify/functions/send-email.js` -- het enige server-side stuk
 * code van de site, en tot 2026-08-15 het enige zonder ook maar één test (issue #71).
 *
 * Er wordt niets echt verstuurd: de mailtransport en de HTTP-call naar Google gaan als
 * afhankelijkheden naar binnen. Wat hier wordt getoetst is precies wat de audit vond en wat de
 * reparatie belooft -- dat de naam doorkomt (#42), dat lege of misvormde invoer wordt geweigerd,
 * dat HTML wordt geescaped, dat de CORS-header niet zomaar teruggekaatst wordt, en dat een interne
 * foutmelding niet naar buiten lekt (#51).
 */

const sendMail = vi.fn();
const fetchMock = vi.fn();

// De twee buitenwereld-afhankelijkheden gaan via de derde parameter van de handler naar binnen.
// Module-mocking werkt hier niet: de function is CommonJS en woont buiten src/, dus Vitest laadt
// haar met Node's eigen require. vi.mock greep daardoor niet op haar require(), en zelfs
// vi.stubGlobal('fetch') werd niet gezien -- de module draait in een andere context. Beide zijn
// gemeten voordat dit patroon gekozen is.
const { handler } = await import('../netlify/functions/send-email.js');

const deps = {
    fetch: (...args: unknown[]) => fetchMock(...args),
    createTransport: () => ({ sendMail }),
};

function captchaAntwoord(data: Record<string, unknown>) {
    return { json: async () => data };
}

// De handler komt uit een .js-bestand, dus tsc leidt het headers-object af als een vaste vorm
// zonder Access-Control-Allow-Origin -- die wordt immers alleen voorwaardelijk gezet. Deze helper
// leest hem als de losse map die het in werkelijkheid is.
function header(res: { headers: unknown }, naam: string): string | undefined {
    return (res.headers as Record<string, string | undefined>)[naam];
}

const ORIGIN = 'https://djcylow.com';

type Body = Record<string, unknown>;

// Levert de body zonder één veld. Bewust geen weglaat-destructurering: die laat een variabele
// achter die niemand leest, en de lint-teller van deze repo staat op 0 warnings.
function zonder(body: Body, veld: string): Body {
    const kopie = { ...body };
    delete kopie[veld];
    return kopie;
}

function verzoek(body: Body, origin: string = ORIGIN, httpMethod = 'POST') {
    return handler(
        {
            httpMethod,
            headers: { origin },
            body: JSON.stringify(body),
            isBase64Encoded: false,
        },
        {},
        deps,
    );
}

const geldig: Body = {
    name: 'Dave Kok',
    email: 'dave@example.com',
    message: 'Graag een offerte voor een bruiloft in juni.',
    'g-recaptcha-response': 'test-token',
};

beforeEach(() => {
    sendMail.mockReset().mockResolvedValue({ messageId: 'x' });
    fetchMock.mockReset().mockResolvedValue(captchaAntwoord({ success: true, hostname: 'djcylow.com' }));

});


describe('geldige aanvraag', () => {
    it('verstuurt de mail en antwoordt met 200', async () => {
        const res = await verzoek(geldig);
        expect(res.statusCode).toBe(200);
        expect(sendMail).toHaveBeenCalledOnce();
    });

    // Dit is issue #42: de function las firstName en lastName, die nergens in src/ bestaan, dus
    // elke boekingsaanvraag kwam binnen als "Boekingsaanvraag: undefined undefined".
    it('zet de naam in het onderwerp en in de body', async () => {
        await verzoek(geldig);
        const mail = sendMail.mock.calls[0][0];
        expect(mail.subject).toBe('Boekingsaanvraag: Dave Kok');
        expect(mail.html).toContain('Dave Kok');
        expect(mail.text).toContain('Dave Kok');
        expect(mail.subject).not.toContain('undefined');
        expect(mail.html).not.toContain('undefined');
    });

    it('zet het adres van de afzender in replyTo', async () => {
        await verzoek(geldig);
        expect(sendMail.mock.calls[0][0].replyTo).toBe('dave@example.com');
    });
});

/**
 * De honeypot: een veld dat met CSS verborgen is, dus een mens laat het leeg en een bot vult het in.
 * Het formulier zette dat veld al neer, maar deze functie las het tot 2026-08-15 nooit uit -- de val
 * ving dus niets (issue #117). Deze tests leggen vast dat hij nu wél dichtgaat, én de manier waarop:
 * met een 200 en zonder mail, zodat een bot niet leert dat de val bestaat.
 */
describe('honeypot', () => {
    it('verstuurt niets als het bot-veld is ingevuld', async () => {
        await verzoek({ ...geldig, 'bot-field': 'ik ben een bot' });
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('antwoordt met 200 en niet met een fout, zodat de val verborgen blijft', async () => {
        const res = await verzoek({ ...geldig, 'bot-field': 'spam' });
        expect(res.statusCode).toBe(200);
    });

    it('laat een leeg bot-veld gewoon door -- dat is wat een mens verstuurt', async () => {
        // Het formulier stuurt het veld altijd mee, dus leeg moet de normale weg volgen.
        const res = await verzoek({ ...geldig, 'bot-field': '' });
        expect(res.statusCode).toBe(200);
        expect(sendMail).toHaveBeenCalled();
    });

    it('stopt vóór de reCAPTCHA-verificatie', async () => {
        // Niet alleen "geen mail": een ingevuld honeypot mag ook geen call naar Google kosten, en
        // de bot mag geen "token ontbreekt"-fout krijgen waaruit hij iets kan afleiden.
        const res = await verzoek(zonder({ ...geldig, 'bot-field': 'spam' }, 'g-recaptcha-response'));
        expect(res.statusCode).toBe(200);
        expect(sendMail).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('negeert een bot-veld dat alleen spaties bevat', async () => {
        const res = await verzoek({ ...geldig, 'bot-field': '   ' });
        expect(res.statusCode).toBe(200);
        expect(sendMail).toHaveBeenCalled();
    });
});

describe('invoervalidatie', () => {
    it.each([
        ['naam', { ...geldig, name: '' }],
        ['e-mail', { ...geldig, email: '' }],
        ['bericht', { ...geldig, message: '' }],
    ])('weigert een lege %s', async (_veld, body) => {
        const res = await verzoek(body);
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('weigert een ontbrekend veld', async () => {
        const res = await verzoek(zonder(geldig, 'name'));
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    // Een JSON-body mag arrays en objecten leveren; die belandden eerder ongecontroleerd in de
    // mail en in replyTo.
    it.each([
        ['array', ['a', 'b']],
        ['object', { onverwacht: true }],
        ['getal', 42],
    ])('weigert een %s waar een string hoort', async (_soort, waarde) => {
        const res = await verzoek({ ...geldig, name: waarde });
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('weigert een misvormd e-mailadres', async () => {
        const res = await verzoek({ ...geldig, email: 'geen-adres' });
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('weigert een bericht boven de lengtelimiet', async () => {
        const res = await verzoek({ ...geldig, message: 'x'.repeat(5001) });
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('weigert een ontbrekend reCAPTCHA-token', async () => {
        const res = await verzoek(zonder(geldig, 'g-recaptcha-response'));
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });
});

describe('escaping in de HTML-mail', () => {
    it('escapet opgemaakte inhoud uit de naam en het bericht', async () => {
        await verzoek({
            ...geldig,
            name: '<script>alert(1)</script>',
            message: 'Zie <b>hier</b> & daar',
        });
        const { html } = sendMail.mock.calls[0][0];
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&amp;');
    });
});

describe('reCAPTCHA', () => {
    it('weigert als Google de verificatie afkeurt', async () => {
        fetchMock.mockResolvedValue(captchaAntwoord({ success: false, 'error-codes': ['timeout-or-duplicate'] }));
        const res = await verzoek(geldig);
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    // Zonder deze controle is een token dat op een ander domein is opgehaald hier net zo geldig.
    it('weigert een token dat op een onbekend domein is opgelost', async () => {
        fetchMock.mockResolvedValue(captchaAntwoord({ success: true, hostname: 'kwaadaardig.example' }));
        const res = await verzoek(geldig);
        expect(res.statusCode).toBe(400);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('accepteert een deploy preview', async () => {
        fetchMock.mockResolvedValue(
            captchaAntwoord({ success: true, hostname: 'deploy-preview-42--djcylow-react.netlify.app' }),
        );
        const res = await verzoek(geldig, 'https://deploy-preview-42--djcylow-react.netlify.app');
        expect(res.statusCode).toBe(200);
    });
});

describe('CORS', () => {
    it('echoot een toegestane origin terug', async () => {
        const res = await verzoek(geldig);
        expect(header(res, 'Access-Control-Allow-Origin')).toBe(ORIGIN);
    });

    it('zet geen origin-header voor een vreemd domein', async () => {
        const res = await verzoek(geldig, 'https://kwaadaardig.example');
        expect(header(res, 'Access-Control-Allow-Origin')).toBeUndefined();
    });

    it('staat nergens de wildcard toe', async () => {
        for (const origin of [ORIGIN, 'https://kwaadaardig.example']) {
            const res = await verzoek(geldig, origin);
            expect(header(res, 'Access-Control-Allow-Origin')).not.toBe('*');
        }
    });

    it('beantwoordt de preflight', async () => {
        const res = await verzoek({}, ORIGIN, 'OPTIONS');
        expect(res.statusCode).toBe(200);
    });

    it('weigert een andere methode dan POST', async () => {
        const res = await verzoek(geldig, ORIGIN, 'GET');
        expect(res.statusCode).toBe(405);
    });
});

describe('foutafhandeling', () => {
    it('lekt de interne foutmelding niet naar de client', async () => {
        sendMail.mockRejectedValue(new Error('getaddrinfo ENOTFOUND smtp.hostinger.example'));
        const res = await verzoek(geldig);
        expect(res.statusCode).toBe(500);
        const body = JSON.parse(res.body);
        expect(body.details).toBeUndefined();
        expect(res.body).not.toContain('ENOTFOUND');
        expect(res.body).not.toContain('hostinger');
    });
});
