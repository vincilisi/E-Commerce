import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
=======
import path from 'node:path';
>>>>>>> master

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

<<<<<<< HEAD
// Usa driver nativo invece di adapter
=======
const databaseUrl = `file:${path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')}`;

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
}

>>>>>>> master
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
