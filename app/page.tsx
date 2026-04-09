import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[var(--color-charcoal)] text-[var(--color-offwhite)] font-inter relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('/images/pattern-bg.png')", backgroundSize: 'cover' }} />
      
      <div className="relative z-10 glass-dark p-12 rounded-2xl max-w-2xl w-full border border-[var(--color-gold)]/20 shadow-2xl">
        <h3 className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4 font-inter">
          Platform Pembuatan Undangan
        </h3>
        
        <h1 className="text-5xl md:text-6xl font-playfair mb-6 text-white leading-tight">
          Bali Inspired<br/>Digital Invitations
        </h1>
        
        <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Sistem manajemen undangan pernikahan digital eksklusif dengan estetika Bali modern, memukau, dan dinamis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/admin/login" className="px-8 py-3 bg-[var(--color-gold)] text-[var(--color-charcoal)] font-semibold rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto">
            Login Admin
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-gray-500 font-inter">
        © {new Date().getFullYear()} UndanganForYou. All rights reserved.
      </footer>
    </main>
  );
}
