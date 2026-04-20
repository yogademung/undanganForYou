import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Cover from '@/components/invitation/Cover';
import Countdown from '@/components/invitation/Countdown';
import VideoScroll from '@/components/invitation/VideoScroll';
import MapsSection from '@/components/invitation/MapsSection';
import GuestBook from '@/components/invitation/GuestBook';
import BaliDivider from '@/components/invitation/BaliDivider';
import AnimateOnScroll from '@/components/invitation/AnimateOnScroll';
import GalleryLightbox from '@/components/invitation/GalleryLightbox';
import HeroSection from '@/components/invitation/HeroSection';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
  });

  if (!invitation) return {};

  const title = `The Wedding of ${invitation.groomNickname} & ${invitation.brideNickname}`;
  const description = `Undangan pernikahan ${invitation.groomFullName} & ${invitation.brideFullName}. Mohon doa restu dan kehadirannya.`;
  
  // Base URL for metadata images
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subak-api.my.id';
  const imageUrl = invitation.coverUrl ? `${siteUrl}${invitation.coverUrl}` : `${siteUrl}/images/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function InvitationPage(props: PageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  let to = typeof searchParams.to === 'string' ? searchParams.to : null;
  const token = typeof searchParams.t === 'string' ? searchParams.t : null;

  if (token) {
    const guestObj = await prisma.guest.findUnique({ where: { token } });
    if (guestObj) {
      to = guestObj.name;
    }
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      images: true,
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  const heroImage = invitation.images.find(img => img.position === 'HERO');
  const brideImage = invitation.images.find(img => img.position === 'BRIDE');
  const groomImage = invitation.images.find(img => img.position === 'GROOM');
  const galleryImages = invitation.images.filter(img => img.position === 'GALLERY_ITEM');

  // coverUrl selalu disinkronkan saat upload COVER via ImageManager maupun form edit
  const coverUrl = invitation.coverUrl || null;

  const title = invitation.title || `${invitation.brideNickname} & ${invitation.groomNickname}`;

  return (
    <>
      <style>{`
        :root {
          --background: ${invitation.backgroundColor || '#FAF9F6'};
        }
        @keyframes ken-burns {
          0% { transform: scale(1) translateZ(0); }
          50% { transform: scale(1.05) translateZ(0); }
          100% { transform: scale(1) translateZ(0); }
        }
        .animate-ken-burns {
          animation: ken-burns 40s ease-in-out infinite;
        }
      `}</style>

      {coverUrl && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center animate-ken-burns opacity-5 pointer-events-none will-change-transform"
          style={{ backgroundImage: `url('${coverUrl}')` }}
        />
      )}
      <main className="min-h-screen relative z-0 font-inter text-gray-900">
        {/* Audio element for backgroud music */}
        {invitation.musicUrl && (
          <audio id="bg-music" src={invitation.musicUrl} loop className="hidden" />
        )}

        {/* Intro Overlay */}
        <Cover guestName={to} title={title} coverUrl={coverUrl} />

        {/* Hero Section */}
        <HeroSection 
          heroImages={[...(heroImage ? [heroImage] : []), ...galleryImages]} 
          groomNickname={invitation.groomNickname} 
          brideNickname={invitation.brideNickname} 
          backgroundColor={invitation.backgroundColor}
        />

        <BaliDivider />

        {/* Couple Section */}
        <section className="py-20 px-4 max-w-5xl mx-auto overflow-hidden text-center">
          <AnimateOnScroll direction="up" className="mb-16 flex items-center justify-center gap-4">
            <div className="h-[1px] bg-[var(--color-gold)]/40 flex-1 max-w-[100px]"></div>
            <span className="text-xl md:text-2xl font-serif font-bold text-[#4A4A4A] tracking-wider uppercase">Bride & Groom</span>
            <div className="h-[1px] bg-[var(--color-gold)]/40 flex-1 max-w-[100px]"></div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" className="mb-16">
            <h3 className="text-2xl md:text-3xl font-playfair text-[var(--color-gold)] mb-6">Mempelai Berbahagia</h3>
            <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed text-sm md:text-base italic">
              "Bukan seberapa membara di mula, tapi siapa yang tetap menggenggam tanganmu ketika raga menua dan langkah tak lagi bertenaga."
            </p>
          </AnimateOnScroll>

          <div className="flex flex-col md:flex-row gap-16 items-center md:items-start justify-center mt-20">
            {/* Groom */}
            <AnimateOnScroll direction="left" className="text-center md:w-1/2 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden mb-8 border-4 border-[var(--color-gold)]/20 shadow-2xl relative">
                {groomImage ? (
                  <img src={groomImage.url} alt="Groom" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <h3 className="text-3xl font-playfair text-[var(--color-gold)] mb-3">{invitation.groomFullName}</h3>
              <div className="mt-2 text-gray-500 text-sm leading-relaxed">
                <p>Putra {invitation.groomChildOrder.toLowerCase()} dari</p>
                <p className="font-semibold text-gray-700 mt-1">Bapak {invitation.groomFather} & Ibu {invitation.groomMother}</p>
                <p className="mt-4 text-xs italic max-w-xs">{invitation.groomAddress}</p>
              </div>
            </AnimateOnScroll>

            {/* Bride */}
            <AnimateOnScroll direction="right" className="text-center md:w-1/2 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden mb-8 border-4 border-[var(--color-gold)]/20 shadow-2xl relative">
                {brideImage ? (
                  <img src={brideImage.url} alt="Bride" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <h3 className="text-3xl font-playfair text-[var(--color-gold)] mb-3">{invitation.brideFullName}</h3>
              <div className="mt-2 text-gray-500 text-sm leading-relaxed">
                <p>Putri {invitation.brideChildOrder.toLowerCase()} dari</p>
                <p className="font-semibold text-gray-700 mt-1">Bapak {invitation.brideFather} & Ibu {invitation.brideMother}</p>
                <p className="mt-4 text-xs italic max-w-xs">{invitation.brideAddress}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <BaliDivider />

        {/* Event Detail & Countdown */}
        <section className="py-20 relative overflow-hidden" style={{
          background: 'linear-gradient(160deg, #1c0f06 0%, #2e1a0a 40%, #1a0d04 100%)'
        }}>
          {/* Batik/Tenun texture subtle overlay */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 10px),
                              repeating-linear-gradient(-45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 10px)`,
            backgroundSize: '14px 14px'
          }} />

          {/* Top decorative band */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{
            background: 'linear-gradient(90deg, transparent, #d4a017, #f0c060, #d4a017, transparent)'
          }} />
          {/* Bottom decorative band */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{
            background: 'linear-gradient(90deg, transparent, #d4a017, #f0c060, #d4a017, transparent)'
          }} />

          <AnimateOnScroll direction="up" className="max-w-4xl mx-auto px-4 text-center relative z-10">
            {/* Section heading with Bali-style ornament */}
            <div className="mb-14 flex flex-col items-center gap-3">
              {/* Small lotus icon above title */}
              <svg width="48" height="28" viewBox="0 0 96 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M48,4 C38,18 24,20 16,14 C26,28 36,30 48,24 C60,30 70,28 80,14 C72,20 58,18 48,4Z" fill="#d4a017" opacity="0.9"/>
                <path d="M48,14 C38,26 26,26 20,20 C30,32 40,32 48,26 C56,32 66,32 76,20 C70,26 58,26 48,14Z" fill="#f0c060" opacity="0.7"/>
                <ellipse cx="48" cy="28" rx="6" ry="3" fill="#d4a017" opacity="0.85"/>
              </svg>
              <h2 className="text-4xl md:text-5xl font-playfair" style={{
                background: 'linear-gradient(135deg, #f0c060 0%, #d4a017 50%, #b8860b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                letterSpacing: '0.05em'
              }}>
                Acara Bahagia
              </h2>
              {/* Decorative line with diamond */}
              <div className="flex items-center gap-3 w-48">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4a017)' }} />
                <div className="w-2 h-2 rotate-45 bg-[#d4a017]" />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }} />
              </div>
            </div>

            {/* Event card - Balinese lontar style */}
            <div className="flex justify-center mb-14">
              <div className="relative w-full max-w-lg" style={{ padding: '3px' }}>
                {/* Gold border gradient wrap */}
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: 'linear-gradient(135deg, #f0c060, #8b6914, #f0c060, #8b6914, #f0c060)',
                  opacity: 0.8
                }} />

                {/* Card inner */}
                <div className="relative rounded-2xl overflow-hidden" style={{
                  background: 'linear-gradient(160deg, rgba(35,20,5,0.96) 0%, rgba(55,30,8,0.96) 100%)',
                  backdropFilter: 'blur(8px)',
                }}>
                  {/* SVG Corner ornaments */}
                  {/* Top-left */}
                  <svg className="absolute top-0 left-0 w-20 h-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4,4 Q30,4 38,16 Q24,16 16,24 Q16,10 4,4Z" fill="#d4a017" opacity="0.25"/>
                    <path d="M4,4 L40,4" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M4,4 L4,40" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M4,14 Q14,14 14,28 Q22,16 36,14" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5"/>
                    <path d="M4,22 Q10,22 14,30" stroke="#f0c060" strokeWidth="0.8" fill="none" opacity="0.5"/>
                    <circle cx="14" cy="14" r="3" fill="#d4a017" opacity="0.6"/>
                    <path d="M16,6 C20,10 18,16 14,16 C18,18 22,14 22,10Z" fill="#f0c060" opacity="0.4"/>
                    <path d="M6,16 C10,20 16,18 16,14 C18,18 14,22 10,22Z" fill="#f0c060" opacity="0.4"/>
                  </svg>
                  {/* Top-right */}
                  <svg className="absolute top-0 right-0 w-20 h-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M76,4 Q50,4 42,16 Q56,16 64,24 Q64,10 76,4Z" fill="#d4a017" opacity="0.25"/>
                    <path d="M76,4 L40,4" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M76,4 L76,40" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M76,14 Q66,14 66,28 Q58,16 44,14" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5"/>
                    <path d="M76,22 Q70,22 66,30" stroke="#f0c060" strokeWidth="0.8" fill="none" opacity="0.5"/>
                    <circle cx="66" cy="14" r="3" fill="#d4a017" opacity="0.6"/>
                    <path d="M64,6 C60,10 62,16 66,16 C62,18 58,14 58,10Z" fill="#f0c060" opacity="0.4"/>
                    <path d="M74,16 C70,20 64,18 64,14 C62,18 66,22 70,22Z" fill="#f0c060" opacity="0.4"/>
                  </svg>
                  {/* Bottom-left */}
                  <svg className="absolute bottom-0 left-0 w-20 h-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4,76 Q30,76 38,64 Q24,64 16,56 Q16,70 4,76Z" fill="#d4a017" opacity="0.25"/>
                    <path d="M4,76 L40,76" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M4,76 L4,40" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M4,66 Q14,66 14,52 Q22,64 36,66" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5"/>
                    <circle cx="14" cy="66" r="3" fill="#d4a017" opacity="0.6"/>
                    <path d="M16,74 C20,70 18,64 14,64 C18,62 22,66 22,70Z" fill="#f0c060" opacity="0.4"/>
                    <path d="M6,64 C10,60 16,62 16,66 C18,62 14,58 10,58Z" fill="#f0c060" opacity="0.4"/>
                  </svg>
                  {/* Bottom-right */}
                  <svg className="absolute bottom-0 right-0 w-20 h-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M76,76 Q50,76 42,64 Q56,64 64,56 Q64,70 76,76Z" fill="#d4a017" opacity="0.25"/>
                    <path d="M76,76 L40,76" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M76,76 L76,40" stroke="#d4a017" strokeWidth="1.5" opacity="0.6"/>
                    <path d="M76,66 Q66,66 66,52 Q58,64 44,66" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5"/>
                    <circle cx="66" cy="66" r="3" fill="#d4a017" opacity="0.6"/>
                    <path d="M64,74 C60,70 62,64 66,64 C62,62 58,66 58,70Z" fill="#f0c060" opacity="0.4"/>
                    <path d="M74,64 C70,60 64,62 64,66 C62,62 66,58 70,58Z" fill="#f0c060" opacity="0.4"/>
                  </svg>

                  {/* Card content */}
                  <div className="px-10 py-10 text-center">
                    {/* Location name */}
                    <h3 className="text-2xl md:text-3xl font-playfair mb-1" style={{
                      background: 'linear-gradient(135deg, #f5d78e, #d4a017)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {invitation.eventLocation}
                    </h3>

                    {/* Lotus divider */}
                    <div className="flex items-center justify-center gap-2 my-5">
                      <div className="flex-1 max-w-[60px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4a017)' }} />
                      <svg width="18" height="18" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                        <path d="M18,4 C12,12 6,12 4,8 C8,16 14,18 18,14 C22,18 28,16 32,8 C30,12 24,12 18,4Z" fill="#d4a017" opacity="0.85"/>
                        <circle cx="18" cy="16" r="4" fill="#f0c060" opacity="0.7"/>
                      </svg>
                      <div className="flex-1 max-w-[60px] h-px" style={{ background: 'linear-gradient(90deg, #d4a017, transparent)' }} />
                    </div>

                    {/* Time */}
                    <p className="text-lg font-semibold tracking-widest mb-4" style={{ color: '#f0c060' }}>
                      {invitation.eventTime}
                    </p>

                    {/* Date - large & bold */}
                    <p className="text-base font-inter font-bold tracking-wide text-white/80">
                      {new Date(invitation.date).toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-4">
              <h3 className="text-xs font-inter text-[#d4a017]/70 mb-8 tracking-[0.4em] uppercase">Menghitung Mundur</h3>
              <Countdown targetDate={invitation.date} />
            </div>
          </AnimateOnScroll>
        </section>

        <BaliDivider />

        {/* Gift Section */}
        {(invitation.bankName || invitation.bankAccount) && (
          <section className="py-16 px-4 overflow-hidden">
            <AnimateOnScroll direction="up" className="max-w-3xl mx-auto text-center glass p-8 md:p-12 rounded-2xl shadow-xl border border-[var(--color-gold)]/20 bg-white">
              <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-playfair text-[var(--color-charcoal)] mb-4">Digital Gift</h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
                Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
                Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 inline-block min-w-[280px]">
                <p className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">{invitation.bankName}</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <p className="text-2xl font-mono text-[var(--color-gold)] tracking-wider">
                    {invitation.bankAccount}
                  </p>
                </div>
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                  a/n {invitation.bankAccountName}
                </p>
              </div>
            </AnimateOnScroll>
          </section>
        )}

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <>
            <BaliDivider />
            <section className="py-16 px-4 max-w-6xl mx-auto overflow-hidden">
              <AnimateOnScroll direction="up">
                <h2 className="text-3xl md:text-4xl font-playfair text-[var(--color-gold)] mb-12 text-center">Our Gallery</h2>
              </AnimateOnScroll>
              <GalleryLightbox images={galleryImages} />
            </section>
          </>
        )}

        {/* Video Section */}
        {invitation.youtubeVideoId && (
          <>
            <BaliDivider />
            <section className="py-16 px-4 overflow-hidden">
              <AnimateOnScroll direction="up">
                <h2 className="text-3xl md:text-4xl font-playfair text-[var(--color-gold)] mb-12 text-center">Our Moment</h2>
                <VideoScroll youtubeVideoId={invitation.youtubeVideoId} />
              </AnimateOnScroll>
            </section>
          </>
        )}

        {/* Maps Section */}
        {invitation.mapUrl && (
          <>
            <BaliDivider />
            <section className="py-16 px-4 overflow-hidden">
              <AnimateOnScroll direction="up">
                <MapsSection address={invitation.address} mapUrl={invitation.mapUrl} />
              </AnimateOnScroll>
            </section>
          </>
        )}

        <BaliDivider />

        {/* Guestbook Section */}
        <section className="py-16 overflow-hidden">
          <AnimateOnScroll direction="up">
            <GuestBook invitationId={invitation.id} slug={invitation.slug} comments={invitation.comments} />
          </AnimateOnScroll>
        </section>

        <footer className="py-8 text-center bg-[var(--color-charcoal)] text-white/60 text-sm mt-16 font-inter">
          <p>&copy; {new Date().getFullYear()} Bali Inspired Invitations. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
