'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

function generateGuestToken(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@*-_.';
  
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  
  const n1 = numbers[Math.floor(Math.random() * numbers.length)];
  const n2 = numbers[Math.floor(Math.random() * numbers.length)];
  
  const s1 = specialChars[Math.floor(Math.random() * specialChars.length)];
  
  const chars = [l1, l2, n1, n2, s1];
  
  // Shuffle the 5 characters
  for (let i = chars.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  
  return chars.join('');
}

export async function addGuest(invitationId: string, formData: FormData) {
  await checkAuth();

  const name = formData.get('name') as string;
  const pax = parseInt(formData.get('pax') as string) || 1;

  // Generate unique token
  let token = generateGuestToken();
  let isUnique = false;
  
  // Ensure token uniqueness
  while (!isUnique) {
    const existing = await prisma.guest.findUnique({ where: { token } });
    if (!existing) {
      isUnique = true;
    } else {
      token = generateGuestToken();
    }
  }

  await prisma.guest.create({
    data: {
      name,
      pax,
      token,
      invitationId
    }
  });

  revalidatePath(`/admin/invitations/${invitationId}/guests`);
}

export async function deleteGuest(id: string, invitationId: string) {
  await checkAuth();

  await prisma.guest.delete({
    where: { id }
  });

  revalidatePath(`/admin/invitations/${invitationId}/guests`);
}
