'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

function extractYoutubeId(url: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

async function processFormData(formData: FormData) {
  const raw = Object.fromEntries(formData);
  let finalMusicUrl = (raw.musicUrl as string) || null;

  const musicFile = formData.get('musicFile') as File | null;
  if (musicFile && musicFile.size > 0 && musicFile.name) {
    if (musicFile.size > 15 * 1024 * 1024) throw new Error("Ukuran file musik terlalu besar (Maks 15MB)");
    try {
      const bytes = await musicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads', 'music');
      await mkdir(uploadDir, { recursive: true });

      const safeName = musicFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}-${safeName}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      finalMusicUrl = `/uploads/music/${fileName}`;
    } catch(err) {
      console.error("Music upload failed", err);
    }
  }

  let finalCoverUrl = (raw.coverUrl as string) || null;

  const coverFile = formData.get('coverFile') as File | null;
  if (coverFile && coverFile.size > 0 && coverFile.name) {
    if (coverFile.size > 5 * 1024 * 1024) throw new Error("Ukuran file gambar cover terlalu besar (Maks 5MB)");
    try {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
      await mkdir(uploadDir, { recursive: true });

      const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '').replace(/\.[^/.]+$/, "");
      const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}-${safeName}.webp`;
      const filePath = join(uploadDir, fileName);
      
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1080, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      
      await writeFile(filePath, optimizedBuffer);
      finalCoverUrl = `/uploads/images/${fileName}`;
    } catch(err) {
      console.error("Cover image upload failed", err);
    }
  }

  return {
    slug: raw.slug as string,
    title: raw.title as string || null,
    
    groomFullName: raw.groomFullName as string,
    groomNickname: raw.groomNickname as string,
    groomFather: raw.groomFather as string,
    groomMother: raw.groomMother as string,
    groomChildOrder: raw.groomChildOrder as string,
    groomAddress: raw.groomAddress as string,
    
    brideFullName: raw.brideFullName as string,
    brideNickname: raw.brideNickname as string,
    brideFather: raw.brideFather as string,
    brideMother: raw.brideMother as string,
    brideChildOrder: raw.brideChildOrder as string,
    brideAddress: raw.brideAddress as string,
    
    date: new Date(raw.date as string),
    eventTime: raw.eventTime as string,
    eventLocation: raw.eventLocation as string,
    address: raw.address as string,
    mapUrl: (raw.mapUrl as string) || null,
    
    bankName: (raw.bankName as string) || null,
    bankAccount: (raw.bankAccount as string) || null,
    bankAccountName: (raw.bankAccountName as string) || null,
    
    youtubeVideoId: extractYoutubeId(raw.youtubeVideoId as string),
    musicUrl: finalMusicUrl,
    coverUrl: finalCoverUrl,
    backgroundColor: (raw.backgroundColor as string) || '#FAF9F6',
  };
}

export async function createInvitation(formData: FormData) {
  let success = false;
  try {
    await checkAuth();

    const data = await processFormData(formData);

    const existingSlug = await prisma.invitation.findUnique({
      where: { slug: data.slug }
    });

    if (existingSlug) {
      return { error: 'Slug (URL unik) tersebut sudah digunakan oleh undangan lain. Silakan ubah slug-nya.' };
    }

    await prisma.invitation.create({
      data
    });
    
    success = true;
  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan undangan baru." };
  }

  if (success) {
    revalidatePath('/admin/dashboard');
    redirect('/admin/dashboard');
  }
}

export async function updateInvitation(formData: FormData) {
  let success = false;
  let finalSlug = '';
  try {
    await checkAuth();

    const id = formData.get('id') as string;
    if (!id) throw new Error("Missing ID for update");

    const data = await processFormData(formData);
    finalSlug = data.slug;

    // Check slug uniqueness if it changed
    const existingSlug = await prisma.invitation.findFirst({
      where: { slug: data.slug, id: { not: id } }
    });

    if (existingSlug) {
      return { error: 'Slug (URL unik) tersebut sudah digunakan oleh undangan lain. Silakan ubah slug-nya.' };
    }

    await prisma.invitation.update({
      where: { id },
      data
    });
    
    success = true;
  } catch (err: any) {
    console.error("Update Invitation Error: ", err);
    return { error: err.stack ? err.stack.toString() : (err.message || "Terjadi kesalahan (tanpa pesan).") };
  }

  if (success) {
    revalidatePath('/admin/dashboard');
    revalidatePath(`/${finalSlug}`);
    redirect('/admin/dashboard');
  }
}
