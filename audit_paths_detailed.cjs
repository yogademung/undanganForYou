const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- DETAILED PATH AUDIT ---');
  
  const invitations = await prisma.invitation.findMany();
  for (const inv of invitations) {
    console.log(`[SLUG: ${inv.slug}]`);
    if (inv.musicUrl) {
      console.log(`  musicUrl: "${inv.musicUrl}"`);
      console.log(`    FirstChar: ${inv.musicUrl.charCodeAt(0)} ('${inv.musicUrl[0]}')`);
    } else {
      console.log('  musicUrl: null');
    }
    if (inv.coverUrl) {
      console.log(`  coverUrl: "${inv.coverUrl}"`);
      console.log(`    FirstChar: ${inv.coverUrl.charCodeAt(0)} ('${inv.coverUrl[0]}')`);
    }
  }

  const images = await prisma.image.findMany();
  if (images.length > 0) {
    console.log(`\n--- IMAGES (${images.length} records) ---`);
    images.slice(0, 5).forEach(img => {
      console.log(`  url: "${img.url}"`);
      console.log(`    FirstChar: ${img.url.charCodeAt(0)} ('${img.url[0]}')`);
    });
  }

  console.log('--- AUDIT FINISHED ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
