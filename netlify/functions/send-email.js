const nodemailer = require('nodemailer');

const RECEIVING_EMAIL = process.env.MAIL_USER;

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
        console.log('--- START CONTACT FORM SUBMISSION (SKIP RECAPTCHA TEST) ---');

        let bodyContent = event.body;
        if (event.isBase64Encoded) {
            bodyContent = Buffer.from(bodyContent, 'base64').toString('utf-8');
        }

        let data;
        try {
            data = JSON.parse(bodyContent);
        } catch (jsonError) {
            const params = new URLSearchParams(bodyContent);
            data = Object.fromEntries(params.entries());
        }

        console.log('DATA ONTVANGEN:', JSON.stringify(data));

        const { firstName, lastName, email, message } = data;

        // TIJDELIJK: We negeren reCAPTCHA verificatie volledig om SMTP te testen
        console.log("DEBUG: reCAPTCHA controle overgeslagen voor SMTP test.");

        // Hostinger transporter
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
            subject: `TEST: Nieuwe aanvraag van ${firstName} ${lastName}`,
            html: `<p>Naam: ${firstName} ${lastName}</p><p>Bericht: ${message}</p>`,
        };

        console.log("Poging tot verzenden e-mail via Hostinger...");
        await transporter.sendMail(mailOptions);
        console.log("E-mail succesvol verzonden!");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Bericht succesvol verzonden (zonder captcha check)!" })
        };

    } catch (error) {
        console.error('Fout in functie:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: `Serverfout: ${error.message}` }),
        };
    }
};