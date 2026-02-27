// prisma.config.ts
// Configurazione compatibile con Prisma 4+
// Non serve più importare defineConfig da "prisma/config"

import { PrismaClient } from "@prisma/client";

// Usa process.env.DATABASE_URL per rendere la configurazione compatibile con sviluppo e produzione
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    },
  },
});

export default prisma;