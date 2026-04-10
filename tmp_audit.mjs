import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';
const p = new PrismaClient();
const cwd = process.cwd();

const invitations = await p.invitation.findMany({
  select: { slug: true, coverUrl: true, musicUrl: true }
});
console.log('=== INVITATIONS ===');
for (const inv of invitations) {
  const cFile = inv.coverUrl && !inv.coverUrl.startsWith('http') ? join(cwd,'public',inv.coverUrl) : null;
  const mFile = inv.musicUrl && !inv.musicUrl.startsWith('http') ? join(cwd,'public',inv.musicUrl) : null;
  console.log(`[${inv.slug}]`);
  console.log(`  coverUrl: ${inv.coverUrl} → ${cFile ? (existsSync(cFile)?'✅ FILE OK':'❌ FILE MISSING') : '(null/external)'}`);
  console.log(`  musicUrl: ${inv.musicUrl} → ${mFile ? (existsSync(mFile)?'✅ FILE OK':'❌ FILE MISSING') : '(null/external)'}`);
}

const images = await p.image.findMany({ select: { id:true, url:true, position:true } });
console.log('\n=== IMAGES TABLE ===');
for (const img of images) {
  const filePath = !img.url.startsWith('http') ? join(cwd,'public',img.url) : null;
  const status = filePath ? (existsSync(filePath) ? '✅ FILE OK' : '❌ FILE MISSING') : '(external)';
  console.log(`  [${img.position}] ${img.url} → ${status}`);
}

await p.$disconnect();
