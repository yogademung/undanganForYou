'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitComment } from '@/app/actions/comment';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 mt-4 rounded-lg font-inter font-medium text-white transition-colors ${
        pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-charcoal)] hover:bg-black'
      }`}
    >
      {pending ? 'Mengirim...' : 'Kirim Ucapan'}
    </button>
  );
}

interface GuestBookProps {
  invitationId: string;
  slug: string;
  comments: Array<{
    id: string;
    name: string;
    text: string;
    isAttending: boolean;
    createdAt: Date;
  }>;
}

export default function GuestBook({ invitationId, slug, comments }: GuestBookProps) {
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const clientAction = async (formData: FormData) => {
    setMessage(null);
    const result = await submitComment(formData, invitationId, slug);
    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Terima kasih atas ucapan Anda!' });
      // Form implicitly reset by the component or we can manually reset here if we use a ref
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-xl p-6 md:p-8 mb-8"
      >
        <h3 className="text-2xl font-playfair text-center mb-6 text-[var(--color-charcoal)]">Buku Tamu</h3>

        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm font-inter ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form action={clientAction}>
          <div className="space-y-4 font-inter text-[var(--color-charcoal)]">
            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-gray-700">Nama Lengkap</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-gold)]" placeholder="Nama Anda" />
            </div>
            
            <div>
              <label htmlFor="text" className="block text-sm mb-1 text-gray-700">Ucapan & Doa</label>
              <textarea id="text" name="text" required rows={4} className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-gold)] resize-none" placeholder="Tulis ucapan dan doa Anda..."></textarea>
            </div>

            <div>
              <span className="block text-sm mb-2 text-gray-700">Konfirmasi Kehadiran</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isAttending" value="true" required className="accent-[var(--color-gold)]" />
                  <span className="text-sm">Hadir</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="isAttending" value="false" required className="accent-[var(--color-gold)]" />
                  <span className="text-sm">Tidak Hadir</span>
                </label>
              </div>
            </div>

            <SubmitButton />
          </div>
        </form>
      </motion.div>

      {/* Komentar List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/40 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[var(--color-charcoal)] font-inter">{comment.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${comment.isAttending ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {comment.isAttending ? 'Hadir' : 'Tidak Hadir'}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-inter leading-relaxed whitespace-pre-wrap">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-3 font-inter">{new Date(comment.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
