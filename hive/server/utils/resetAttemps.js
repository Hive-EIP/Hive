// server/utils/resetAttempts.js
const redis = require('../config/redisClient');

async function resetAttempts(email) {
    const key = `reset:${email}`;
    try {
        const existed = await redis.del(key);
        if (existed) {
            console.log(`✅ Tentatives supprimées pour ${email}`);
        } else {
            console.log(`ℹ️ Aucune tentative enregistrée pour ${email}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur de suppression :', err);
        process.exit(1);
    }
}

// Lecture de l'email en argument CLI
const email = process.argv[2]?.toLowerCase().trim();
if (!email) {
    console.error('❌ Usage : node resetAttempts.js email@example.com');
    process.exit(1);
}

resetAttempts(email);
