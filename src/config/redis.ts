import { createClient } from 'redis';

const redis = await createClient({
    url: process.env.REDIS_URL
})

redis.on("error", (error) => {
    console.error("Redis client error: ", error);
})

export default redis;