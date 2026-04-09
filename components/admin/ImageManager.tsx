'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImageManagerProps {
  invitationId: string;
  slug: string;
  images: Array<{ id: string; url: string; position: string }>;
}

export default function ImageManager({ invitationId, slug, images }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('invitationId', invitationId);
    formData.append('slug', slug);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Reset form
        (e.target as HTMLFormElement).reset();
        router.refresh(); // Refresh server component data
      } else {
        alert('Gagal mengupload gambar.');
      }
    } catch (err) {
      alert('Terjadi kesalahan.');
    } finally {
      setUploading(false);
    }
  };

  const positions = ['HERO', 'BRIDE', 'GROOM', 'GALLERY_ITEM', 'COVER'];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-800">Upload Gambar Baru</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Gambar (JPEG/PNG)</label>
            <input type="file" name="file" accept="image/jpeg, image/png, image/webp" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Gambar</label>
            <select name="position" required className="w-full px-4 py-2 border rounded-md bg-white">
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">HERO, BRIDE, dan GROOM hanya akan menyimpan 1 gambar terbaru.</p>
          </div>
          <button type="submit" disabled={uploading} className={`px-6 py-2 rounded-md text-white font-medium ${uploading ? 'bg-gray-400' : 'bg-[var(--color-charcoal)] hover:bg-black'} transition-colors`}>
            {uploading ? 'Mengupload...' : 'Upload'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-800">Gambar Tersimpan</h2>
        {positions.map((pos) => {
           const posImages = images.filter(i => i.position === pos);
           return (
             <div key={pos} className="mb-6 last:mb-0">
               <h3 className="font-semibold text-gray-700 mb-3">{pos} {pos === 'GALLERY_ITEM' ? `(${posImages.length})` : ''}</h3>
               <div className="flex flex-wrap gap-4">
                 {posImages.length === 0 ? <p className="text-sm text-gray-400 italic">Belum ada gambar.</p> : null}
                 {posImages.map(img => (
                   <div key={img.id} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                     <img src={img.url} alt={img.position} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
