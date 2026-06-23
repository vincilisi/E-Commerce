import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
=======
<<<<<<< HEAD
=======
import path from 'node:path';
>>>>>>> master
>>>>>>> main

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

<<<<<<< HEAD
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
=======
<<<<<<< HEAD
// Usa driver nativo invece di adapter
=======
const databaseUrl = `file:${path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')}`;
>>>>>>> main

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
<<<<<<< HEAD
=======

>>>>>>> master
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
>>>>>>> main
