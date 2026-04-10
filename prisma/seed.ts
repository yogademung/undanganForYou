import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ============================================================
  // 1. Admin Account
  // Ubah username dan password sesuai kebutuhan production
  // ============================================================
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: { username: adminUsername, password: hashed },
    });
    console.log(`✅ Admin dibuat: username="${adminUsername}"`);
  } else {
    console.log(`ℹ️  Admin "${adminUsername}" sudah ada, dilewati.`);
  }

  // ============================================================
  // 2. Contoh Undangan Demo (opsional — untuk testing)
  // Hapus blok ini jika production tidak butuh data demo.
  // Gambar di-upload manual via admin panel (/admin/invitations).
  // ============================================================
  const demoSlug = 'demo';
  const existing = await prisma.invitation.findUnique({ where: { slug: demoSlug } });

  if (!existing) {
    await prisma.invitation.create({
      data: {
        slug: demoSlug,
        title: 'Budi & Sari',
        groomFullName: 'Budi Santoso',
        groomNickname: 'Budi',
        groomFather: 'Bapak Santoso',
        groomMother: 'Ibu Wati',
        groomChildOrder: 'Pertama',
        groomAddress: 'Jl. Melati No. 1, Denpasar, Bali',
        brideFullName: 'Sari Dewi',
        brideNickname: 'Sari',
        brideFather: 'Bapak Dewi',
        brideMother: 'Ibu Ayu',
        brideChildOrder: 'Kedua',
        brideAddress: 'Jl. Kenanga No. 5, Denpasar, Bali',
        date: new Date('2025-12-12T09:00:00+08:00'),
        eventTime: '09:00 WITA - Selesai',
        eventLocation: 'Puri Santrian Bali',
        address: 'Jl. Sanur Blok A, Denpasar Selatan, Bali',
        mapUrl: null,
        bankName: 'BCA',
        bankAccount: '1234567890',
        bankAccountName: 'Budi Santoso',
        backgroundColor: '#FAF9F6',
        // coverUrl, musicUrl, youtubeVideoId: null — upload via admin panel
      },
    });
    console.log(`✅ Undangan demo dibuat: slug="${demoSlug}"`);
    console.log(`   ⚡ Upload gambar & musik via: /admin/invitations`);
  } else {
    console.log(`ℹ️  Undangan "${demoSlug}" sudah ada, dilewati.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
