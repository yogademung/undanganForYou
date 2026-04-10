const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const invitations = await prisma.invitation.findMany({
    select: { id: true, slug: true, musicUrl: true, coverUrl: true }
  });
  console.log('--- INVITATIONS ---');
  console.log(JSON.stringify(invitations, null, 2));

  const images = await prisma.image.findMany({
    select: { id: true, url: true, position: true, invitationId: true }
  });
  console.log('\n--- IMAGES ---');
  console.log(JSON.stringify(images, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
