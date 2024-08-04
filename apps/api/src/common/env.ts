import {getEnv} from 'typescript-utils/src/env';

interface EnvVariables {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    PEPPER: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    RMQ_URL: string;

    TRANSFERO_CLIENT_ID: string;
    TRANSFERO_CLIENT_SECRET: string;
    TRANSFERO_AUTH_SCOPE: string;
    TRANSFERO_URL: string;
}

export const env: EnvVariables = {
    NODE_ENV: getEnv('NODE_ENV', false, 'development'),
    PORT: parseInt(getEnv('PORT', false, '3000')),
    DATABASE_URL: getEnv('DATABASE_URL'),
    PEPPER: getEnv('PEPPER'),
    REDIS_URL: getEnv('REDIS_URL'),
    JWT_SECRET: getEnv('JWT_SECRET'),
    RMQ_URL: getEnv('RMQ_URL'),

    TRANSFERO_CLIENT_ID: getEnv('TRANSFERO_CLIENT_ID'),
    TRANSFERO_CLIENT_SECRET: getEnv('TRANSFERO_CLIENT_SECRET'),
    TRANSFERO_AUTH_SCOPE: getEnv('TRANSFERO_AUTH_SCOPE'),
    TRANSFERO_URL: getEnv('TRANSFERO_URL'),
};
