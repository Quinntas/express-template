import {expect, test} from 'vitest';

test('Environment Variables Retrieval', async () => {
    const originalEnv = process.env;

    process.env = {
        PORT: '3000',
        DATABASE_URL: 'test_db_url',
        PEPPER: 'test_pepper',
        REDIS_URL: 'test_redis_url',
        JWT_SECRET: 'test_jwt_secret',
        DEFAULT_ROLE_ID: '1',
    };

    const {env} = await import('./env');

    const expectedEnv = {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_URL: 'test_db_url',
        PEPPER: 'test_pepper',
        REDIS_URL: 'test_redis_url',
        JWT_SECRET: 'test_jwt_secret',
        DEFAULT_ROLE_ID: 1,
    };

    expect(env).toEqual(expectedEnv);

    process.env = originalEnv;
});
