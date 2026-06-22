const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const byEmail = await prisma.user.findUnique({ where: { email: 'admin@stella.it' } });
  const byRole = byEmail || (await prisma.user.findFirst({ where: { role: 'admin' } }));

  if (!byRole) {
    console.log('NO_ADMIN');
    return;
  }

  console.log('ADMIN_FOUND');
  console.log(JSON.stringify({ id: byRole.id, email: byRole.email, name: byRole.name, role: byRole.role, createdAt: byRole.createdAt }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
