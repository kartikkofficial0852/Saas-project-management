import redis from "../config/redis.js";

const cacheService = {
    async get<T>(key: string): Promise<T | null> {

        const data = await redis.get(key);

        if (!data) {
            return null;
        }
        return JSON.parse(data) as T;
    },

    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
        await redis.set(key, JSON.stringify(value), {
            EX: ttlSeconds
        });
    },

    async delete(key: string): Promise<void> {
        await redis.del(key);
    },
}

export default cacheService;