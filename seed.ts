import { PrismaClient, ImagePosition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Admin user created successfully!');
  console.log('Username: admin');
  console.log('Password: admin123');

  // Define future date (1 month from now)
  const eventDate = new Date();
  eventDate.setMonth(eventDate.getMonth() + 1);

  const invitation = await prisma.invitation.upsert({
    where: { slug: 'demo-invitation' },
    update: {
      // Intentionally omitting update object content so it stays as is if already seeded,
      // but feel free to modify if you want to force updates on run.
    },
    create: {
      slug: 'demo-invitation',
      title: 'The Wedding of Wayan & Ayu',
      groomFullName: 'I Wayan Pasek',
      groomNickname: 'Wayan',
      groomFather: 'I Nyoman Mudana',
      groomMother: 'Ni Made Sari',
      groomChildOrder: 'Putra Pertama',
      groomAddress: 'Banjar Tengah, Desa Adat Bali',
      brideFullName: 'Ni Kadek Ayu',
      brideNickname: 'Ayu',
      brideFather: 'I Ketut Suardiana',
      brideMother: 'Ni Putu Wati',
      brideChildOrder: 'Putri Kedua',
      brideAddress: 'Banjar Kaja, Desa Adat Bali',
      date: eventDate,
      eventTime: '09:00 WITA - Selesai',
      eventLocation: 'Puri Agung Bali',
      address: 'Jl. Raya Denpasar - Gianyar, Bali',
      mapUrl: 'https://maps.google.com/?q=-8.650000,115.216667',
      bankName: 'BCA',
      bankAccount: '1234567890',
      bankAccountName: 'I Wayan Pasek',
      youtubeVideoId: 'LXb3EKWsInQ', // Sample video ID
      musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder, user will host local MP3 according to past conversations
      backgroundColor: '#FAF9F6',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=800&q=80', position: ImagePosition.HERO },
          { url: 'https://images.unsplash.com/photo-1601004149959-190675ea016d?w=800&q=80', position: ImagePosition.GROOM },
          { url: 'https://images.unsplash.com/photo-1544275150-de942f74127c?w=800&q=80', position: ImagePosition.BRIDE },
          { url: 'https://images.unsplash.com/photo-1577903254921-2a6c2fcaf2dd?w=800&q=80', position: ImagePosition.GALLERY_ITEM },
          { url: 'https://images.unsplash.com/photo-1583939411023-14783179e581?w=800&q=80', position: ImagePosition.GALLERY_ITEM },
          { url: 'https://images.unsplash.com/photo-1621801306185-ce1bb279eabb?w=800&q=80', position: ImagePosition.GALLERY_ITEM },
          { url: 'https://images.unsplash.com/photo-1595180017124-70a92d4157fa?w=800&q=80', position: ImagePosition.COVER },
        ]
      },
      guests: {
        create: [
          { name: 'Bapak Made & Keluarga', pax: 4, token: 'TAMU001' },
          { name: 'Ibu Nyoman', pax: 2, token: 'TAMU002' },
          { name: 'Arya', pax: 1, token: 'TAMU003' },
        ]
      },
      comments: {
        create: [
          { name: 'Bapak Made', text: 'Selamat menempuh hidup baru Wayan dan Ayu! Semoga langgeng selalu.', isAttending: true },
          { name: 'Ibu Nyoman', text: 'Rahayu, semoga acaranya dilancarkan.', isAttending: true },
        ]
      }
    }
  });

  console.log('✨ Demo invitation seeded successfully!');
  console.log(`URL Path: /${invitation.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
