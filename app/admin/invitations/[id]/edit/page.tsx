import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import EditInvitationForm from '@/components/admin/EditInvitationForm';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditInvitationPage(props: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const { id } = await props.params;

  const invitation = await prisma.invitation.findUnique({
    where: { id }
  });

  if (!invitation) notFound();

  return (
    <div className="min-h-screen bg-gray-50 font-inter py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Undangan: {invitation.slug}</h1>
        <EditInvitationForm invitation={invitation} />
      </div>
    </div>
  );
}
