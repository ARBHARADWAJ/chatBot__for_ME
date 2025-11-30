import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis Connected');
    } catch (error) {
        console.error('❌ Redis Connection Error:', error);
        // Depending on your app's needs, you might want to exit process here
        // process.exit(1); 
    }
};

export default redisClient;