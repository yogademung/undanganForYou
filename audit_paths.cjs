const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING RELATIVE PATH AUDIT ---');
  
  const images = await prisma.image.findMany();
  for (const img of images) {
    if (img.url && !img.url.startsWith('/') && !img.url.startsWith('http')) {
       console.log(`[RELATIVE-IMAGE] ${img.url}`);
    }
  }

  const invitations = await prisma.invitation.findMany();
  for (const inv of invitations) {
    if (inv.musicUrl && !inv.musicUrl.startsWith('/') && !inv.musicUrl.startsWith('http')) {
       console.log(`[RELATIVE-MUSIC] ${inv.slug}: ${inv.musicUrl}`);
    }
    if (inv.coverUrl && !inv.coverUrl.startsWith('/') && !inv.coverUrl.startsWith('http')) {
       console.log(`[RELATIVE-COVER] ${inv.slug}: ${inv.coverUrl}`);
    }
  }

  console.log('--- AUDIT FINISHED ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
