import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { comments: true, images: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link href="/admin/invitations/new" className="bg-[var(--color-charcoal)] text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-medium">
            + Buat Undangan
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/50 text-gray-600 text-sm">
                <th className="p-4 font-medium border-b">Mempelai</th>
                <th className="p-4 font-medium border-b">Slug</th>
                <th className="p-4 font-medium border-b">Tanggal</th>
                <th className="p-4 font-medium border-b text-center">Images</th>
                <th className="p-4 font-medium border-b text-center">Comments</th>
                <th className="p-4 font-medium border-b text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada undangan dibuat.</td>
                </tr>
              ) : (
                invitations.map((inv: any) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-gray-800">{inv.brideNickname} & {inv.groomNickname}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{inv.slug}</td>
                    <td className="p-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-4 text-center text-gray-600">{inv._count.images}</td>
                    <td className="p-4 text-center text-gray-600">{inv._count.comments}</td>
                    <td className="p-4 space-x-2 text-right">
                      <Link href={`/admin/invitations/${inv.id}/guests`} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200">
                        Tamu
                      </Link>
                      <Link href={`/admin/invitations/${inv.id}/edit`} className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200">
                        Edit
                      </Link>
                      <Link href={`/admin/invitations/${inv.id}/images`} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200">
                        Foto
                      </Link>
                      <Link href={`/${inv.slug}`} target="_blank" className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
