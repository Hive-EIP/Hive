// server/utils/resetLimiter.js
const redis = require('../config/redisClient');

const MAX_ATTEMPTS = 5;
const TTL_SECONDS = 60 * 60 * 24; // 24h

async function incrementResetAttempts(email) {
    const key = `reset_attempts:${email}`;

    const attempts = await redis.incr(key);

    if (attempts === 1) {
        await redis.expire(key, TTL_SECONDS); // expire en 24h
    }

    return attempts;
}

async function getRemainingAttempts(email) {
    const key = `reset_attempts:${email}`;
    const count = await redis.get(key);
    return MAX_ATTEMPTS - (parseInt(count) || 0);
}

module.exports = {
    incrementResetAttempts,
    getRemainingAttempts
};
