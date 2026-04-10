import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const invitationId = formData.get('invitationId') as string;
    const position = formData.get('position') as 'HERO' | 'BRIDE' | 'GROOM' | 'GALLERY_ITEM' | 'COVER';

    if (!file || !invitationId || !position) {
      return NextResponse.json({ error: 'Missing required fields: file, invitationId, position' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File kosong' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Semua gambar disimpan di satu folder standar: /public/uploads/images/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    await fs.mkdir(uploadDir, { recursive: true });

    // Nama file: timestamp-random.webp (relasi ke undangan via DB foreign key, bukan nama file)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const filePath = path.join(uploadDir, filename);

    // Process & compress image dengan sharp
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    // Verifikasi file benar-benar tersimpan sebelum update DB
    const savedStat = await fs.stat(filePath).catch(() => null);
    if (!savedStat || savedStat.size === 0) {
      return NextResponse.json({ error: 'Gagal menyimpan file ke server' }, { status: 500 });
    }

    const url = `/uploads/images/${filename}`;

    // Untuk posisi single (bukan GALLERY_ITEM), hapus record & file lama
    if (position !== 'GALLERY_ITEM') {
      const existing = await prisma.image.findFirst({
        where: { invitationId, position }
      });
      if (existing) {
        if (existing.url.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), 'public', existing.url);
          await fs.unlink(oldFilePath).catch(() => {});
        }
        await prisma.image.delete({ where: { id: existing.id } });
      }
    }

    // Simpan record ke database
    const image = await prisma.image.create({
      data: { url, position, invitationId }
    });

    // Jika COVER, sinkronkan juga ke kolom invitation.coverUrl
    if (position === 'COVER') {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { coverUrl: url }
      });
    }

    return NextResponse.json({ success: true, image, url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to process file upload'
    }, { status: 500 });
  }
}
