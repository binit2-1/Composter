import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

try {
  const comp = await prisma.component.findFirst({
    where: { title: 'NotificationCard' },
    select: { id: true, title: true, code: true, dependencies: true }
  });
  
  if (comp) {
    console.log('Title:', comp.title);
    console.log('Dependencies:', comp.dependencies);
    const files = JSON.parse(comp.code);
    console.log('Files:', Object.keys(files));
    console.log('\n--- First file preview ---');
    console.log(Object.values(files)[0].substring(0, 600));
  } else {
    console.log('NotificationCard not found');
  }
} catch (e) {
  console.error(e);
} finally {
  await prisma.$disconnect();
}
