const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  try {
    const r = await prisma.resident.findUnique({ where: { email: 'nguyenvanan@gmail.com' } });
    if (!r) {
      console.log('no user');
      return;
    }
    const ok = await bcrypt.compare('123', r.password);
    console.log('compare', ok);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
