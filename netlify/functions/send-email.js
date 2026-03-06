const nodemailer = require('nodemailer');
const axios = require('axios');

// Vaste ontvanger: Dit is het e-mailadres waar u de berichten op ontvangt
const RECEIVING_EMAIL = process.env.MAIL_USER;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

let transporter;

// ** LOKALE TEST MODUS (NETLIFY DEV) **
if (process.env.NETLIFY_DEV) {
    console.warn('!!! LOKALE TEST MODUS: SMTP-verzending wordt gesimuleerd !!!');
    transporter = {
        sendMail: (mailOptions) => {
            console.log('======================================================');
            console.log('  MOCK E-MAIL VERZONDEN (LOKAAL NETLIFY DEV)');
            console.log('======================================================');
            console.log('  VAN:', mailOptions.from);
            console.log('  AAN:', mailOptions.to);
            console.log('  ONDERWERP:', mailOptions.subject);
            console.log('======================================================');
            return Promise.resolve({ messageId: 'mock-local-123', response: '250 Mock Accepted' });
        }
    };
} else {
    // Hostinger transporter
    transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10) || 465,
        secure: true, 
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS, 
        },
    });
}

exports.handler = async (event) => {
    const header = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-header': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, header, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, header, body: JSON.stringify({ error: 'Methode niet toegestaan' }) };
    }

    let data;

    try {
        console.log('--- START CONTACT FORM SUBMISSION ---');

        // 1. Decodering van de Body
        let bodyContent = event.body;
        if (event.isBase64Encoded) {
            bodyContent = Buffer.from(bodyContent, 'base64').toString('utf-8');
        }

        // 2. Parsen van de data
        try {
            data = JSON.parse(bodyContent);
        } catch (jsonError) {
            const params = new URLSearchParams(bodyContent);
            data = Object.fromEntries(params.entries());
        }

        // Honeypot check
        if (data['bot-field'] && data['bot-field'].trim() !== "") {
            console.warn("Honeypot gevuld, bot gedetecteerd.");
            return { statusCode: 200, header, body: JSON.stringify({ message: "Bericht ontvangen!" }) };
        }

        // Velden uit nieuwe HTML
        const { firstName, lastName, email, message } = data;
        const token = data['g-recaptcha-response'];

        if (!firstName || !lastName || !email || !message) {
            return {
                statusCode: 400,
                header,
                body: JSON.stringify({ error: 'Niet alle verplichte velden zijn ingevuld.' })
            };
        }

        // 3. RECAPTCHA VERIFICATIE
        let verificationData = { success: false };

        if (process.env.NETLIFY_DEV) {
            verificationData = { success: true };
        } else {
            if (!token) {
                return { statusCode: 400, header, body: JSON.stringify({ error: 'reCAPTCHA token ontbreekt.' }) };
            }

            const recaptchaParams = new URLSearchParams();
            recaptchaParams.append('secret', RECAPTCHA_SECRET_KEY);
            recaptchaParams.append('response', token);

            const verificationResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', recaptchaParams.toString(), {
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            verificationData = verificationResponse.data;
        }

        if (!verificationData.success) {
            return { statusCode: 400, header, body: JSON.stringify({ error: 'reCAPTCHA verificatie mislukt.' }) };
        }

        // 4. E-MAIL CONFIGURATIE
        const fromEmail = process.env.MAIL_USER || 'noreply@djcylow.com';
        const senderDisplayName = `Contactformulier DJ Cylow`;

        const mailOptions = {
            from: `"${senderDisplayName}" <${fromEmail}>`,
            to: RECEIVING_EMAIL,
            replyTo: email,
            subject: `Nieuwe boekingsaanvraag: ${firstName} ${lastName}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                    <h2>Nieuw bericht van de website</h2>
                    <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
                    <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Bericht:</strong></p>
                    <div style="padding: 15px; border-left: 4px solid #000; background-color: #f9f9f9;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `,
        };

        // 5. Verzenden
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            header,
            body: JSON.stringify({ message: "Bericht succesvol verzonden!" })
        };

    } catch (error) {
        console.error('Fout in Netlify Function:', error);
        return {
            statusCode: 500,
            header,
            body: JSON.stringify({ error: `Serverfout: ${error.message}` }),
        };
    }
};