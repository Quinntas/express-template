require("dotenv").config();

interface EnvVariables {
    PORT: number
    DATABASE_URL: string
    PEPPER: string
}

function getEnv(envName: string, required: boolean = true): string {
    const result = process.env[envName] as string;
    if (!result && required)
        throw new Error(`Environment variable ${envName} not found`);
    return result ?? undefined;
}

export const env: EnvVariables = {
    PORT: parseInt(getEnv("PORT")),
    DATABASE_URL: getEnv("DATABASE_URL"),
    PEPPER: getEnv("PEPPER")
}


