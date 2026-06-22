import { PrismaClient } from '@prisma/client';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const databaseUrl = `file:${path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')}`;

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
