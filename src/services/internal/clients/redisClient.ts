import {Redis} from 'ioredis';

type RedisTypes = string | number | Buffer | null;

/**
 * Represents the configuration for caching a value in the Redis store.
 * @template T - The type of the value to cache.
 */
export interface CacheItConfig<T> {
    expires?: number;
    key: string;
    generator: () => Promise<T> | T;
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
}

/**
 * Represents a Redis client for interacting with a Redis store.
 */
export class RedisClient {
    private client: Redis;
    private readonly defaultTokenExpiryTime: number = 3600; // 1 hour

    constructor(url: string) {
        this.client = new Redis(url);
    }

    /**
     * Caches a value in the Redis store based on the provided configuration.
     *
     * @template T - The type of the value to cache.
     * @param {CacheItConfig<T>} config - The configuration for caching the value.
     * @return {Promise<T>} A promise that resolves to the cached value.
     */
    public async cacheIt<T>(config: CacheItConfig<T>): Promise<T> {
        const cacheRes = await this.client.get(config.key);
        if (!cacheRes) {
            const res = await config.generator();
            await this.set(config.key, config.serialize(res), config.expires);
            return res;
        }
        return config.deserialize(cacheRes);
    }

    /**
     * Deletes a value by key from the client.
     *
     * @param {string} key - The key of the value to delete.
     * @return {Promise<number>} A promise that resolves to the number of deleted values.
     */
    public async delete(key: string): Promise<number> {
        return this.client.del(key);
    }

    /**
     * Set a key-value pair in the Redis store with an optional expiry time.
     * @param {string} key - The key to set in the Redis store.
     * @param {RedisTypes} value - The value to set in the Redis store.
     * @param {number} tokenExpiryTime - The optional expiry time for the key, in seconds. Defaults to the default token expiry time.
     * @throws {Error} Throws an error if the value is null or undefined.
     * @return {Promise<boolean>} Returns a promise that resolves to true if the key-value pair was set successfully, false otherwise.
     */
    public async set(key: string, value: RedisTypes, tokenExpiryTime: number = this.defaultTokenExpiryTime): Promise<boolean> {
        if (!value) throw new Error('Value cannot be null or undefined');
        const reply = await this.client.set(key, value);
        const ok = reply === 'OK';
        if (!ok) return false;
        await this.client.expire(key, tokenExpiryTime);
        return ok;
    }

    /**
     * Retrieves the value associated with the specified key from the client.
     *
     * @param {string} key - The key for which the value needs to be retrieved.
     * @returns {Promise<string|null>} - A promise that resolves with the value associated with the key,
     *                                  or null if the key is not found.
     */
    public async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }
}
