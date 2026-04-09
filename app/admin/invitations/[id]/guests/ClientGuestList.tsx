'use client';

import { deleteGuest } from '@/app/actions/guest';
import { useState } from 'react';

type Guest = {
  id: string;
  name: string;
  pax: number;
  token: string;
};

export default function ClientGuestList({ guests, invitationSlug, invitationId }: { guests: Guest[]; invitationSlug: string; invitationId: string; }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (token: string, guestId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const secureLink = `${origin}/${invitationSlug}?t=${token}`;
    
    navigator.clipboard.writeText(secureLink).then(() => {
      setCopiedId(guestId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (guestId: string) => {
    if (confirm("Hapus tamu ini secara permanen?")) {
      await deleteGuest(guestId, invitationId);
    }
  };

  if (guests.length === 0) {
     return <div className="text-center text-gray-500 py-8">Belum ada tamu yang ditambahkan. Silakan tambahkan pada form di kiri.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 rounded-tl-md">Nama Diundang</th>
            <th className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-center">Pax</th>
            <th className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Token</th>
            <th className="py-3 px-4 font-semibold text-gray-700 bg-gray-50 text-right rounded-tr-md">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
              <td className="py-3 px-4 text-gray-800 font-medium">{guest.name}</td>
              <td className="py-3 px-4 text-gray-600 text-center">{guest.pax}</td>
              <td className="py-3 px-4 text-gray-500 font-mono text-sm">{guest.token}</td>
              <td className="py-3 px-4 text-right space-x-2">
                <button 
                  onClick={() => handleCopy(guest.token, guest.id)}
                  className={`inline-block px-3 py-1.5 text-sm rounded-md transition-all border ${
                    copiedId === guest.id 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {copiedId === guest.id ? 'Copied URL!' : 'Copy Link'}
                </button>
                <button 
                  onClick={() => handleDelete(guest.id)}
                  className="inline-block px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
