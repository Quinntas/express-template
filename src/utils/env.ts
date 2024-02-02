require("dotenv").config();

interface EnvVariables {
    PORT: number
    DATABASE_URL: string
    PEPPER: string
}

function getEnv(envName: string): string {
    const result = process.env[envName] as string;
    if (!result)
        throw new Error(`Environment variable ${envName} not found`);
    return result;
}

export const env: EnvVariables = {
    PORT: parseInt(getEnv("PORT")),
    DATABASE_URL: getEnv("DATABASE_URL"),
    PEPPER: getEnv("PEPPER")
}


