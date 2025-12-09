const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const r = await prisma.resident.findUnique({ where: { email: 'nguyenvanan@gmail.com' } });
    console.log(r);
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
})();
