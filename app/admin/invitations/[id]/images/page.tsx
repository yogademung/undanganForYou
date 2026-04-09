import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ImageManager from '@/components/admin/ImageManager';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvitationImagesPage(props: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const { id } = await props.params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: { images: true }
  });

  if (!invitation) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Gambar: <span className="text-[var(--color-gold)]">{invitation.slug}</span></h1>
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-black hover:underline font-medium">
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        <ImageManager 
          invitationId={invitation.id} 
          slug={invitation.slug} 
          images={invitation.images} 
        />
      </div>
    </div>
  );
}
