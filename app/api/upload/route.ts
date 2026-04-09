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
    const slug = formData.get('slug') as string;
    const position = formData.get('position') as 'HERO' | 'BRIDE' | 'GROOM' | 'GALLERY_ITEM';

    if (!file || !invitationId || !slug || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', slug);

    // Create dir if not exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    // Process image with sharp
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    const url = `/uploads/${slug}/${filename}`;

    // Replace if position is strictly single (HERO, BRIDE, GROOM)
    if (position !== 'GALLERY_ITEM') {
      const existing = await prisma.image.findFirst({
        where: { invitationId, position }
      });
      if (existing) {
        await prisma.image.delete({ where: { id: existing.id } });
      }
    }

    // Save record to database
    const image = await prisma.image.create({
      data: {
        url,
        position,
        invitationId
      }
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}
