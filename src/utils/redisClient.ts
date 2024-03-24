import {Redis} from 'ioredis';

type RedisTypes = string | number | Buffer | null;

export class RedisClient {
    private client: Redis;
    private readonly defaultTokenExpiryTime: number = 3600;

    constructor(url: string) {
        this.client = new Redis(url);
    }

    public async delete(key: string): Promise<number> {
        return this.client.del(key);
    }

    public async set(key: string, value: RedisTypes, tokenExpiryTime: number = this.defaultTokenExpiryTime): Promise<string> {
        if (!value) throw new Error('Value cannot be null or undefined');
        const reply = await this.client.set(key, value);
        await this.client.expire(key, tokenExpiryTime);
        return reply;
    }

    public async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }
}
