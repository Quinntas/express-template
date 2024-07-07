import {InternalError} from '../core/errors';

require('dotenv').config();

/**
 * Retrieves the value of the specified environment variable.
 *
 * @param {string} envName - The name of the environment variable to retrieve.
 * @param {boolean} [required=true] - Indicates whether the environment variable is required. Defaults to true.
 * @param {string | undefined} [defaultValue=undefined] - The default value to return if the environment variable is not found. Defaults to undefined.
 * @returns {string} - The value of the environment variable, or the default value if it is not found and not required.
 * @throws {InternalError} - If the environment variable is required but not found.
 */
function getEnv(envName: string, required: boolean = true, defaultValue: string | undefined = undefined): string {
    const result = process.env[envName] as string;
    if (!result && required) throw new InternalError(`Environment variable ${envName} not found`);
    return result ?? defaultValue;
}

interface EnvVariables {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    PEPPER: string;
    REDIS_URL: string;
    JWT_SECRET: string;
}

export const env: EnvVariables = {
    NODE_ENV: getEnv('NODE_ENV', false, 'development'),
    PORT: parseInt(getEnv('PORT', false, '3000')),
    DATABASE_URL: getEnv('DATABASE_URL'),
    PEPPER: getEnv('PEPPER'),
    REDIS_URL: getEnv('REDIS_URL'),
    JWT_SECRET: getEnv('JWT_SECRET'),
};
