'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function submitComment(formData: FormData, invitationId: string, slug: string) {
  try {
    const name = formData.get('name') as string;
    const text = formData.get('text') as string;
    const isAttendingRaw = formData.get('isAttending') as string;

    if (!name || !text || !isAttendingRaw) {
      return { error: 'Semua field harus diisi.' };
    }

    const isAttending = isAttendingRaw === 'true';

    await prisma.comment.create({
      data: {
        name,
        text,
        isAttending,
        invitationId,
      },
    });

    revalidatePath(`/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit comment:', error);
    return { error: 'Gagal mengirim komentar. Silakan coba lagi.' };
  }
}

export async function submitInstagramComment(text: string, invitationId: string, slug: string, guestName?: string) {
  try {
    if (!text || text.trim() === '') {
      return { error: 'Komentar tidak boleh kosong.' };
    }

    await prisma.comment.create({
      data: {
        name: guestName || 'Guest',
        text,
        isAttending: true,
        invitationId,
      },
    });

    revalidatePath(`/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit Instagram comment:', error);
    return { error: 'Gagal mengirim komentar.' };
  }
}
