import {Redis} from 'ioredis';

type RedisTypes = string | number | Buffer | null;

/**
 * Represents a Redis client for interacting with a Redis store.
 */
export class RedisClient {
    private client: Redis;
    private readonly defaultTokenExpiryTime: number = 3600;

    constructor(url: string) {
        this.client = new Redis(url);
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
