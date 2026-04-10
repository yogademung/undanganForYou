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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('invitationId', invitationId);
    // Semua gambar disimpan ke /uploads/images/ — slug tidak digunakan lagi

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal mengupload gambar.');
      }
    } catch {
      alert('Terjadi kesalahan saat upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Hapus gambar ini permanen dari server?')) return;
    setDeletingId(imageId);
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal menghapus gambar.');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus.');
    } finally {
      setDeletingId(null);
    }
  };

  const positions = ['HERO', 'BRIDE', 'GROOM', 'COVER', 'GALLERY_ITEM'];
  const positionLabels: Record<string, string> = {
    HERO: 'Hero (latar belakang hero section)',
    BRIDE: 'Bride (foto pengantin wanita)',
    GROOM: 'Groom (foto pengantin pria)',
    COVER: 'Cover (latar overlay pembuka)',
    GALLERY_ITEM: 'Gallery (bisa lebih dari 1)',
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-1 font-inter text-gray-800">Upload Gambar Baru</h2>
        <p className="text-xs text-gray-400 mb-4">Semua gambar disimpan di <code className="bg-gray-100 px-1 rounded">/uploads/images/</code></p>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Gambar (JPEG/PNG/WebP)</label>
            <input type="file" name="file" accept="image/jpeg, image/png, image/webp" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Gambar</label>
            <select name="position" required className="w-full px-4 py-2 border rounded-md bg-white">
              {positions.map(p => (
                <option key={p} value={p}>{p} — {positionLabels[p]}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">HERO, BRIDE, GROOM, COVER hanya simpan 1 gambar terbaru. GALLERY_ITEM bisa banyak.</p>
          </div>
          <button type="submit" disabled={uploading} className={`px-6 py-2 rounded-md text-white font-medium ${uploading ? 'bg-gray-400' : 'bg-[var(--color-charcoal)] hover:bg-black'} transition-colors`}>
            {uploading ? 'Mengupload...' : 'Upload Gambar'}
          </button>
        </form>
      </div>

      {/* Gambar Tersimpan */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-800">Gambar Tersimpan</h2>
        {positions.map((pos) => {
          const posImages = images.filter(i => i.position === pos);
          return (
            <div key={pos} className="mb-6 last:mb-0">
              <h3 className="font-semibold text-gray-700 mb-3">
                {pos} {pos === 'GALLERY_ITEM' ? `(${posImages.length})` : ''}
              </h3>
              <div className="flex flex-wrap gap-4">
                {posImages.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Belum ada gambar.</p>
                ) : (
                  posImages.map(img => (
                    <div key={img.id} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                      <img
                        src={img.url}
                        alt={img.position}
                        className="w-full h-full object-cover"
                      />
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                        title="Hapus gambar"
                      >
                        {deletingId === img.id ? '...' : '🗑 Hapus'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
