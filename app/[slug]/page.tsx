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

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

  const animatedBackgroundUrl = invitation.coverUrl || invitation.images.find(img => img.position === 'COVER')?.url;

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

      {animatedBackgroundUrl && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center animate-ken-burns opacity-5 pointer-events-none will-change-transform"
          style={{ backgroundImage: `url('${animatedBackgroundUrl}')` }}
        />
      )}
      <main className="min-h-screen relative z-0 font-inter text-gray-900">
        {/* Audio element for backgroud music */}
        {invitation.musicUrl && (
          <audio id="bg-music" src={invitation.musicUrl} loop className="hidden" />
        )}

        {/* Intro Overlay */}
        <Cover guestName={to} title={title} coverUrl={invitation.coverUrl} />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center relative p-4 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {heroImage ? (
              <img src={heroImage.url} alt="Hero" className="w-full h-full object-cover opacity-60" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2d2925] opacity-60" />
            )}
          </div>
          <AnimateOnScroll delay={0.6} className="glass-dark p-8 rounded-2xl max-w-2xl text-white">
            <p className="text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Pernikahan Suci</p>
            <h1 className="text-5xl md:text-7xl font-playfair mb-6 mt-4">{title}</h1>
            <p className="text-lg text-gray-300 italic mb-8">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            </p>
          </AnimateOnScroll>
        </section>

        <BaliDivider />

        {/* Couple Section */}
        <section className="py-16 px-4 max-w-5xl mx-auto overflow-hidden">
          <AnimateOnScroll direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair text-[var(--color-gold)] mb-4">Yang Berbahagia</h2>
            <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed text-sm md:text-base">Maha Suci Tuhan yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Tuhan, perkenankanlah kami merangkai kasih sayang yang Kau ciptakan di antara putra-putri kami:</p>
          </AnimateOnScroll>

          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-center">

            {/* Groom */}
            <AnimateOnScroll direction="left" className="text-center md:w-1/2 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden mb-6 border-4 border-[var(--color-gold)] shadow-xl relative">
                {groomImage ? (
                  <img src={groomImage.url} alt="Groom" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <h3 className="text-3xl font-playfair text-[var(--color-charcoal)] mb-3">{invitation.groomFullName}</h3>
              <p className="text-[var(--color-gold)] font-medium mb-2">"{invitation.groomNickname}"</p>
              <div className="mt-2 text-gray-600 text-sm">
                <p>Putra {invitation.groomChildOrder.toLowerCase()} dari Bapak {invitation.groomFather}</p>
                <p>& Ibu {invitation.groomMother}</p>
                <p className="mt-2 text-gray-500 max-w-xs">{invitation.groomAddress}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" className="text-[var(--color-gold)] font-playfair text-6xl my-10 md:my-0 md:mt-24">&</AnimateOnScroll>

            {/* Bride */}
            <AnimateOnScroll direction="right" className="text-center md:w-1/2 flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden mb-6 border-4 border-[var(--color-gold)] shadow-xl relative">
                {brideImage ? (
                  <img src={brideImage.url} alt="Bride" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <h3 className="text-3xl font-playfair text-[var(--color-charcoal)] mb-3">{invitation.brideFullName}</h3>
              <p className="text-[var(--color-gold)] font-medium mb-2">"{invitation.brideNickname}"</p>
              <div className="mt-2 text-gray-600 text-sm">
                <p>Putri {invitation.brideChildOrder.toLowerCase()} dari Bapak {invitation.brideFather}</p>
                <p>& Ibu {invitation.brideMother}</p>
                <p className="mt-2 text-gray-500 max-w-xs">{invitation.brideAddress}</p>
              </div>
            </AnimateOnScroll>

          </div>
        </section>

        <BaliDivider />

        {/* Event Detail & Countdown */}
        <section className="py-20 bg-[var(--color-charcoal)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/images/pattern-bg.png')" }} />

          <AnimateOnScroll direction="up" className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-playfair text-[var(--color-gold)] mb-16">Acara Bahagia</h2>

            <div className="flex justify-center mb-16">
              <div className="glass bg-white p-10 rounded-2xl w-full max-w-lg border border-[var(--color-gold)]/30 shadow-2xl relative overflow-hidden text-center">
                {/* Decorative Corner */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[var(--color-gold)] rounded-tl-xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[var(--color-gold)] rounded-br-xl opacity-50" />

                <h3 className="text-2xl font-bold mb-6 font-inter text-[var(--color-charcoal)]">{invitation.eventLocation}</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="text-[var(--color-gold)] text-xl font-medium">{invitation.eventTime}</p>
                  <p className="text-lg font-semibold border-b border-[var(--color-gold)]/20 pb-4 inline-block">
                    {new Date(invitation.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="pt-2 text-sm max-w-xs mx-auto leading-relaxed">{invitation.address}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-inter text-gray-300 mb-8 tracking-widest uppercase text-sm">Menghitung Mundur</h3>
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
