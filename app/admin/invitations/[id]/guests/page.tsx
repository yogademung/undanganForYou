import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import GuestForm from './GuestForm';
import ClientGuestList from './ClientGuestList';

type PageProps = { params: Promise<{ id: string }> };

export default async function GuestsPage(props: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const { id } = await props.params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: { guests: { orderBy: { createdAt: 'desc' } } }
  });

  if (!invitation) notFound();

  // Create absolute base URL for the copy function
  // We don't have access to standard router domain reliably on server sometimes, 
  // so we'll pass the relative link and let the client convert it via window.location.origin

  return (
    <div className="min-h-screen font-inter bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div>
             <h1 className="text-2xl font-bold text-gray-800">Kelola Tamu Undangan</h1>
             <p className="text-gray-500 mt-1">Undangan: <span className="font-semibold">{invitation.slug}</span></p>
           </div>
           <Link href="/admin/dashboard" className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium">
              Kembali
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
               <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-4">Tambah Tamu</h2>
               <GuestForm invitationId={id} />
             </div>
           </div>
           
           <div className="md:col-span-2">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-4 border-b pb-3">Daftar Tamu Tersimpan ({invitation.guests.length})</h2>
               <ClientGuestList guests={invitation.guests} invitationSlug={invitation.slug} invitationId={id} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
