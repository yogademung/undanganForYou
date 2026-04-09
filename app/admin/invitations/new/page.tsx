import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createInvitation } from '@/app/actions/invitation';

export default async function NewInvitationPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-gray-50 font-inter py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Buat Undangan Baru</h1>

        <form action={createInvitation} className="space-y-8">
          {/* General */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Data Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL unik)</label>
                <input type="text" name="slug" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="contoh: romeo-juliet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Undangan / The Wedding Of</label>
                <input type="text" name="title" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="Romeo & Juliet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background</label>
                <div className="flex h-[42px] border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[var(--color-gold)]">
                  <input type="color" name="backgroundColor" defaultValue="#FAF9F6" className="w-12 h-full p-0 border-0 cursor-pointer" />
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
                <input type="text" name="groomFullName" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input type="text" name="groomNickname" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bapak</label>
                <input type="text" name="groomFather" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input type="text" name="groomMother" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anak Ke-</label>
                <input type="text" name="groomChildOrder" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="Contoh: Pertama / 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal Lengkap</label>
                <textarea name="groomAddress" required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Bride */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Data Mempelai Wanita (👩 Perempuan)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Pengantin</label>
                <input type="text" name="brideFullName" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input type="text" name="brideNickname" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bapak</label>
                <input type="text" name="brideFather" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                <input type="text" name="brideMother" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anak Ke-</label>
                <input type="text" name="brideChildOrder" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="Contoh: Kedua / 2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal Lengkap</label>
                <textarea name="brideAddress" required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* Event */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Detail Acara</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hari, Tanggal & Bulan</label>
                <input type="datetime-local" name="date" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai Acara</label>
                <input type="text" name="eventTime" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="Contoh: 09:00 WITA - Selesai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Acara (Nama Tempat)</label>
                <input type="text" name="eventLocation" required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="Gedung Serbaguna..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Acara Berlangsung</label>
                <textarea name="address" required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <input type="url" name="mapUrl" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </section>

          {/* Gift / Banking */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Digital Gift / Rekening</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <input type="text" name="bankName" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="BCA / Mandiri" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Rekening</label>
                <input type="text" name="bankAccount" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
                <input type="text" name="bankAccountName" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="A/n Pemilik" />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Media Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Background / Cover</label>
                <input type="file" name="coverFile" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link / Video ID</label>
                <input type="text" name="youtubeVideoId" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Musik Latar (.mp3)</label>
                <input type="file" name="musicFile" accept="audio/*" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button type="submit" className="bg-[var(--color-gold)] text-white px-8 py-3 rounded-lg hover:bg-yellow-600 font-medium transition-colors w-full md:w-auto text-lg shadow-md">
              Simpan Undangan Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
