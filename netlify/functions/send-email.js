const nodemailer = require('nodemailer');
const axios = require('axios');

const RECEIVING_EMAIL = process.env.MAIL_USER;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        console.log('--- START VEILIGE FORMULIER VERWERKING ---');

        let bodyContent = event.body;
        if (event.isBase64Encoded) {
            bodyContent = Buffer.from(bodyContent, 'base64').toString('utf-8');
        }

        let data;
        try {
            data = JSON.parse(bodyContent);
        } catch (e) {
            data = Object.fromEntries(new URLSearchParams(bodyContent));
        }

        const { firstName, lastName, email, message } = data;
        const token = data['g-recaptcha-response'];

        if (!token) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA token ontbreekt.' }) };
        }

        // 1. VERIFIEER BIJ GOOGLE
        const recaptchaParams = new URLSearchParams();
        recaptchaParams.append('secret', RECAPTCHA_SECRET_KEY);
        recaptchaParams.append('response', token);

        const verifyRes = await axios.post('https://www.google.com/recaptcha/api/siteverify', recaptchaParams.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!verifyRes.data.success) {
            console.error("Google weigerde verificatie:", verifyRes.data['error-codes']);
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'reCAPTCHA verificatie mislukt.' }) };
        }

        console.log("reCAPTCHA succesvol geverifieerd.");

        // 2. VERSTUUR MAIL VIA HOSTINGER
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10) || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Contactformulier" <${process.env.MAIL_USER}>`,
            to: RECEIVING_EMAIL,
            replyTo: email,
            subject: `Boekingsaanvraag: ${firstName} ${lastName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #333;">Nieuw bericht van djcylow.com</h2>
                    <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Bericht:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("E-mail succesvol verzonden!");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Bericht succesvol verzonden!" })
        };

    } catch (error) {
        console.error('Fout in functie:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: `Er is iets misgegaan: ${error.message}` }),
        };
    }
};