const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendResetEmail(to, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <p>Tu as demandé à réinitialiser ton mot de passe.</p>
            <p>Clique sur ce lien pour continuer :</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Ce lien expire dans 1 heure.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail;
