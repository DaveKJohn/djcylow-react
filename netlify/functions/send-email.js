const nodemailer = require('nodemailer');
const axios = require('axios');

const RECEIVING_EMAIL = process.env.MAIL_USER;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

let transporter;

if (process.env.NETLIFY_DEV) {
    console.warn('!!! LOKALE TEST MODUS !!!');
    transporter = {
        sendMail: (mailOptions) => {
            console.log('MOCK MAIL VERZONDEN');
            return Promise.resolve({ messageId: 'mock-123' });
        }
    };
} else {
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
    // Gebruik overal exact 'headers'
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode niet toegestaan' }) };
    }

    let data;

    try {
        console.log('--- START CONTACT FORM SUBMISSION ---');

        let bodyContent = event.body;
        if (event.isBase64Encoded) {
            bodyContent = Buffer.from(bodyContent, 'base64').toString('utf-8');
        }

        try {
            data = JSON.parse(bodyContent);
        } catch (jsonError) {
            const params = new URLSearchParams(bodyContent);
            data = Object.fromEntries(params.entries());
        }

        // Dit is de cruciale logregel voor de debug
        console.log('DATA VOOR VALIDATIE:', JSON.stringify(data));

        if (data['bot-field'] && data['bot-field'].trim() !== "") {
            console.warn("Honeypot gevuld.");
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Ontvangen!" }) };
        }

        const { firstName, lastName, email, message } = data;
        const token = data['g-recaptcha-response'];

        if (!firstName || !lastName || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Niet alle verplichte velden zijn ingevuld.' })
            };
        }

        // 3. RECAPTCHA VERIFICATIE
        let verificationData = { success: false };

        if (process.env.NETLIFY_DEV) {
            console.log("DEBUG: Overslaan reCAPTCHA in Dev modus");
            verificationData = { success: true };
        } else {
            if (!token) {
                console.error("DEBUG: Token ontbreekt in de data");
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA token ontbreekt.' }) };
            }

            const recaptchaParams = new URLSearchParams();
            recaptchaParams.append('secret', RECAPTCHA_SECRET_KEY);
            recaptchaParams.append('response', token);

            try {
                // LET OP: Hier stond 'header', moet 'headers' zijn (meervoud)
                const verificationResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', recaptchaParams.toString(), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });

                verificationData = verificationResponse.data;
                console.log('GOOGLE RECAPTCHA RESULTAAT:', JSON.stringify(verificationData));
            } catch (axiosError) {
                console.error('AXIOS/GOOGLE FOUT:', axiosError.message);
                return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kon reCAPTCHA niet verifiëren' }) };
            }
        }

        if (!verificationData.success) {
            console.error("RECAPTCHA GEWEIGERD. Foutcodes:", JSON.stringify(verificationData['error-codes']));
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA verificatie mislukt.' }) };
        }

        const fromEmail = process.env.MAIL_USER || 'noreply@djcylow.com';
        const mailOptions = {
            from: `"Contactformulier" <${fromEmail}>`,
            to: RECEIVING_EMAIL,
            replyTo: email,
            subject: `Nieuwe boekingsaanvraag: ${firstName} ${lastName}`,
            html: `
                <div style="font-family: sans-serif;">
                    <h2>Nieuw bericht</h2>
                    <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Bericht:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Bericht succesvol verzonden!" })
        };

    } catch (error) {
        console.error('Fout in Netlify Function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: `Serverfout: ${error.message}` }),
        };
    }
};