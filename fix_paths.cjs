const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING PATH FIX ---');
  
  // 1. Fix Image table urls
  const images = await prisma.image.findMany();
  for (const img of images) {
    if (img.url && img.url.startsWith('uploads/')) {
      const newUrl = '/' + img.url;
      await prisma.image.update({
        where: { id: img.id },
        data: { url: newUrl }
      });
      console.log(`[FIX-IMAGE] ${img.url} -> ${newUrl}`);
    }
  }

  // 2. Fix Invitation table urls
  const invitations = await prisma.invitation.findMany();
  for (const inv of invitations) {
    let updateData = {};
    if (inv.musicUrl && inv.musicUrl.startsWith('uploads/')) {
      updateData.musicUrl = '/' + inv.musicUrl;
      console.log(`[FIX-MUSIC] ${inv.slug}: ${inv.musicUrl} -> ${updateData.musicUrl}`);
    }
    if (inv.coverUrl && inv.coverUrl.startsWith('uploads/')) {
      updateData.coverUrl = '/' + inv.coverUrl;
      console.log(`[FIX-COVER] ${inv.slug}: ${inv.coverUrl} -> ${updateData.coverUrl}`);
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.invitation.update({
        where: { id: inv.id },
        data: updateData
      });
    }
  }

  console.log('--- PATH FIX FINISHED ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
