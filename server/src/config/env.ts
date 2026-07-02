import dotenv from 'dotenv';

dotenv.config();

function requiredEnv(name: string) {
    const value = process.env[name];

    if (!value)
        throw new Error(`Missing required environment variable: ${name}`);

    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: requiredEnv("PORT"),
    DATABASE_URL: requiredEnv("DATABASE_URL"),
    CLIENT_URL: requiredEnv("CLIENT_URL"),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}