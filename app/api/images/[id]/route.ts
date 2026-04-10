import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await req.json();
    if (!imageId) {
      return NextResponse.json({ error: 'Missing imageId' }, { status: 400 });
    }

    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Hapus file fisik jika path lokal
    if (image.url.startsWith('/uploads/images/')) {
      const filePath = path.join(process.cwd(), 'public', image.url);
      await fs.unlink(filePath).catch(() => {}); // abaikan jika sudah tidak ada
    }

    // Jika ini adalah COVER, clear invitation.coverUrl juga
    if (image.position === 'COVER') {
      await prisma.invitation.updateMany({
        where: { id: image.invitationId, coverUrl: image.url },
        data: { coverUrl: null }
      });
    }

    await prisma.image.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Image Error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
