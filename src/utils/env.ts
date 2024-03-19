require("dotenv").config();

function getEnv(envName: string, required: boolean = true, defaultValue: string | undefined = undefined): string {
    const result = process.env[envName] as string;
    if (!result && required)
        throw new Error(`Environment variable ${envName} not found`);
    return result ?? defaultValue;
}

interface EnvVariables {
    NODE_ENV: string
    PORT: number
    DATABASE_URL: string
    PEPPER: string
    REDIS_URL: string
    JWT_SECRET: string
}

export const env: EnvVariables = {
    NODE_ENV: getEnv("NODE_ENV", false, "development"),
    PORT: parseInt(getEnv("PORT", false, "3000")),
    DATABASE_URL: getEnv("DATABASE_URL"),
    PEPPER: getEnv("PEPPER"),
    REDIS_URL: getEnv("REDIS_URL"),
    JWT_SECRET: getEnv("JWT_SECRET")
}
