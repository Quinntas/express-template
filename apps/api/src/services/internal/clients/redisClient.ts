import {Redis} from 'ioredis';
import {Err, Ok} from 'ts-results';

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
    public client: Redis;
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
    public async delete(key: string) {
        const res = this.client.del(key);
        if (!res) return Err.EMPTY;
        return Ok(res);
    }

    public async set(key: string, value: RedisTypes, tokenExpiryTime: number = this.defaultTokenExpiryTime) {
        if (!value) throw new Error('Value cannot be null or undefined');
        const reply = await this.client.set(key, value);
        if (reply === 'OK') return Err.EMPTY;
        await this.client.expire(key, tokenExpiryTime);
        return Ok.EMPTY;
    }

    public async get(key: string) {
        const res = await this.client.get(key);
        if (!res) return Err.EMPTY;
        return Ok(res);
    }
}
