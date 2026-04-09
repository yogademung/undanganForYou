'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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
    try {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
      await mkdir(uploadDir, { recursive: true });

      const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const fileName = `${Date.now()}-${Math.floor(Math.random()*1000)}-${safeName}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
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
  await checkAuth();

  const data = await processFormData(formData);

  await prisma.invitation.create({
    data
  });

  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
}

export async function updateInvitation(formData: FormData) {
  await checkAuth();

  const id = formData.get('id') as string;
  if (!id) throw new Error("Missing ID for update");

  const data = await processFormData(formData);

  await prisma.invitation.update({
    where: { id },
    data
  });

  revalidatePath('/admin/dashboard');
  revalidatePath(`/${data.slug}`);
  redirect('/admin/dashboard');
}
