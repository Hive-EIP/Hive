const axios = require('axios');
require('dotenv').config();

async function verifyCaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log("🧪 Token reçu:", token);
    console.log("🔐 Clé secrète utilisée:", secretKey);

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: secretKey,
                response: token
            }
        });
        console.log("📨 Réponse de Google:", response.data);

        return response.data.success;
    } catch (error) {
        console.error('Erreur de vérification CAPTCHA :', error);
        return false;
    }
}

module.exports = verifyCaptcha;
