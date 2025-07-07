const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Connected to Redis');
});

redisClient.connect();

module.exports = redisClient;
