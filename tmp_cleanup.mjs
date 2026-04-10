/**
 * Bersihkan DB: hapus semua record image dengan URL eksternal atau file yang tidak ada di disk.
 * Juga bersihkan invitation.coverUrl dan musicUrl yang invalid.
 */
import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

const p = new PrismaClient();
const cwd = process.cwd();

// --- Bersihkan tabel images ---
const images = await p.image.findMany();
for (const img of images) {
  // Hapus jika URL eksternal
  if (img.url.startsWith('http')) {
    await p.image.delete({ where: { id: img.id } });
    console.log(`[DEL-EXTERNAL] ${img.position}: ${img.url.slice(0, 60)}...`);
    continue;
  }
  // Hapus jika file tidak ada di disk
  const filePath = join(cwd, 'public', img.url);
  if (!existsSync(filePath)) {
    await p.image.delete({ where: { id: img.id } });
    console.log(`[DEL-MISSING] ${img.position}: ${img.url}`);
    continue;
  }
  console.log(`[OK] ${img.position}: ${img.url}`);
}

// --- Bersihkan invitation.coverUrl & musicUrl ---
const invitations = await p.invitation.findMany({
  select: { id: true, slug: true, coverUrl: true, musicUrl: true }
});
for (const inv of invitations) {
  const updates: Record<string, string | null> = {};

  if (inv.coverUrl) {
    if (inv.coverUrl.startsWith('http') || !existsSync(join(cwd, 'public', inv.coverUrl))) {
      updates.coverUrl = null;
      console.log(`[CLEAR-COVER] ${inv.slug}: ${inv.coverUrl}`);
    } else {
      console.log(`[COVER-OK] ${inv.slug}: ${inv.coverUrl}`);
    }
  }

  if (inv.musicUrl) {
    if (inv.musicUrl.startsWith('http') || !existsSync(join(cwd, 'public', inv.musicUrl))) {
      updates.musicUrl = null;
      console.log(`[CLEAR-MUSIC] ${inv.slug}: ${inv.musicUrl}`);
    } else {
      console.log(`[MUSIC-OK] ${inv.slug}: ${inv.musicUrl}`);
    }
  }

  if (Object.keys(updates).length > 0) {
    await p.invitation.update({ where: { id: inv.id }, data: updates });
  }
}

await p.$disconnect();
console.log('\nDB cleanup selesai.');
