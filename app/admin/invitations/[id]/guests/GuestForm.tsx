'use client';

import { addGuest } from '@/app/actions/guest';
import { useRef, useState } from 'react';

export default function GuestForm({ invitationId }: { invitationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await addGuest(invitationId, formData);
      formRef.current?.reset();
    } catch (error) {
       alert("Gagal menambahkan tamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Diundang</label>
        <input 
          type="text" 
          name="name" 
          required 
          className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" 
          placeholder="cth: Bapak Andi & Kel" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Pax (Orang)</label>
        <input 
          type="number" 
          name="pax" 
          min="1"
          defaultValue="1" 
          required 
          className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] outline-none" 
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-2 bg-[var(--color-gold)] text-white font-medium rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Menambahkan...' : 'Simpan Tamu'}
      </button>
    </form>
  );
}
