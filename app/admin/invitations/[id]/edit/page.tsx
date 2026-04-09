import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { updateInvitation } from '@/app/actions/invitation';

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

        <form action={updateInvitation} className="space-y-8">
          <input type="hidden" name="id" value={id} />
          {/* General */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Data Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL unik)</label>
                <input type="text" name="slug" defaultValue={invitation.slug} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Undangan / The Wedding Of</label>
                <input type="text" name="title" defaultValue={invitation.title || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background</label>
                <div className="flex h-[42px] border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[var(--color-gold)]">
                  <input type="color" name="backgroundColor" defaultValue={invitation.backgroundColor || '#FAF9F6'} className="w-12 h-full p-0 border-0 cursor-pointer" />
                  <span className="flex-1 px-3 py-2 text-sm text-gray-500 bg-gray-50 truncate flex items-center">Pilih Warna Latar</span>
                </div>
              </div>
            </div>
          </section>

          {/* Groom */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Data Mempelai Pria (👨 Laki-laki)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Pengantin</label>
                <input type="text" name="groomFullName" defaultValue={invitation.groomFullName} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input type="text" name="groomNickname" defaultValue={invitation.groomNickname} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bapak</label>
                <input type="text" name="groomFather" defaultValue={invitation.groomFather} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input type="text" name="groomMother" defaultValue={invitation.groomMother} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anak Ke-</label>
                <input type="text" name="groomChildOrder" defaultValue={invitation.groomChildOrder} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal Lengkap</label>
                <textarea name="groomAddress" defaultValue={invitation.groomAddress} required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Bride */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Data Mempelai Wanita (👩 Perempuan)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Pengantin</label>
                <input type="text" name="brideFullName" defaultValue={invitation.brideFullName} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input type="text" name="brideNickname" defaultValue={invitation.brideNickname} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bapak</label>
                <input type="text" name="brideFather" defaultValue={invitation.brideFather} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input type="text" name="brideMother" defaultValue={invitation.brideMother} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anak Ke-</label>
                <input type="text" name="brideChildOrder" defaultValue={invitation.brideChildOrder} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal Lengkap</label>
                <textarea name="brideAddress" defaultValue={invitation.brideAddress} required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Event */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Detail Acara</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hari, Tanggal & Bulan</label>
                <input type="datetime-local" name="date" defaultValue={new Date(invitation.date.getTime() - invitation.date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai Acara</label>
                <input type="text" name="eventTime" defaultValue={invitation.eventTime} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Acara (Nama Tempat)</label>
                <input type="text" name="eventLocation" defaultValue={invitation.eventLocation} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Acara Berlangsung</label>
                <textarea name="address" defaultValue={invitation.address} required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Musik Latar Baru (.mp3)</label>
                {invitation.musicUrl && (
                   <p className="text-xs text-gray-500 mb-2 truncate">🎵 Saat ini: {invitation.musicUrl.split('/').pop()}</p>
                )}
                <input type="file" name="musicFile" accept="audio/*" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
                <input type="hidden" name="musicUrl" value={invitation.musicUrl || ''} />
              </div>
            </div>
          </section>

          {/* Gift / Banking */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Digital Gift / Rekening</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <input type="text" name="bankName" defaultValue={invitation.bankName || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Rekening</label>
                <input type="text" name="bankAccount" defaultValue={invitation.bankAccount || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
                <input type="text" name="bankAccountName" defaultValue={invitation.bankAccountName || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Media Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID / URL</label>
                <input type="text" name="youtubeVideoId" defaultValue={invitation.youtubeVideoId || ''} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Background Flash Awal (Cover)</label>
                {invitation.coverUrl && (
                   <p className="text-xs text-[var(--color-gold)] mb-2 truncate">🖼️ Aktif: {invitation.coverUrl.split('/').pop()}</p>
                )}
                <input type="file" name="coverFile" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
                <input type="hidden" name="coverUrl" value={invitation.coverUrl || ''} />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button type="submit" className="bg-[var(--color-gold)] text-white px-8 py-3 rounded-lg hover:bg-yellow-600 font-medium transition-colors w-full md:w-auto text-lg shadow-md">
              Perbarui Undangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
