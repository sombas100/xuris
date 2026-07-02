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
    OPENAI_API_KEY: requiredEnv('OPENAI_API_KEY'),
    AWS_REGION: requiredEnv('AWS_REGION'),
    AWS_ACCESS_KEY_ID: requiredEnv('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY: requiredEnv('AWS_SECRET_ACCESS_KEY'),
    AWS_S3_BUCKET_NAME: requiredEnv('AWS_S3_BUCKET_NAME'),
}