import {expect, test, vi} from 'vitest';
import {RedisClient} from './redisClient';

vi.mock('../../../../utils/env', () => ({
    env: {},
}));

vi.mock('ioredis', () => {
    return {
        Redis: class {
            private data: Map<string, string> = new Map();

            async del(key: string): Promise<number> {
                return this.data.delete(key) ? 1 : 0;
            }

            async set(key: string, value: any): Promise<string> {
                this.data.set(key, String(value));
                return 'OK';
            }

            async get(key: string): Promise<string | null> {
                return this.data.get(key) ?? null;
            }

            async expire(_key: string, _seconds: number): Promise<boolean> {
                return true;
            }
        },
    };
});

test('RedisClient - Set and Get', async () => {
    const redisClient = new RedisClient('test_url');
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value);
    const retrievedValue = await redisClient.get(key);

    expect(retrievedValue).toEqual(value);
});

test('RedisClient - Delete', async () => {
    const redisClient = new RedisClient('test_url');
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value);
    const deletedCount = await redisClient.delete(key);

    expect(deletedCount).toEqual(1);
});

test('RedisClient - Error on Setting null Value', async () => {
    const redisClient = new RedisClient('test_url');
    const key = 'testKey';
    const value = null;

    await expect(redisClient.set(key, value)).rejects.toThrowError('Value cannot be null or undefined');
});
