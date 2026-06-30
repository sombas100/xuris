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
    PORT: process.env.PORT,

}