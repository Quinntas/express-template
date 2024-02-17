require("dotenv").config();

interface EnvVariables {
    NODE_ENV: string
    PORT: number
    DATABASE_URL: string
    PEPPER: string
    REDIS_URL: string
}

function getEnv(envName: string, required: boolean = true, defaultValue: string | undefined = undefined): string {
    const result = process.env[envName] as string;
    if (!result && required)
        throw new Error(`Environment variable ${envName} not found`);
    return result ?? defaultValue;
}

export const env: EnvVariables = {
    NODE_ENV: getEnv("NODE_ENV", false, "development"),
    PORT: parseInt(getEnv("PORT")),
    DATABASE_URL: getEnv("DATABASE_URL"),
    PEPPER: getEnv("PEPPER"),
    REDIS_URL: getEnv("REDIS_URL")
}


