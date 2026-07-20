import { prisma } from "../lib/prisma.js";


export const database = () => {
    async function connect() {
        console.log("Checking database connection...");

        try {
            await prisma.$connect()
            console.log("Database connection established");
        } catch (error: unknown) {
            console.log(`Database connection failed: ${error}`)
            throw error;
        }
    }

    async function disconnect() {
        await prisma.$disconnect();
    }

    return { connect, disconnect }
}