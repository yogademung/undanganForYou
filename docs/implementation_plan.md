# Bali-Inspired Digital Invitation Platform

Platform undangan digital pernikahan dengan estetika Bali — menggunakan Next.js 15 (App Router), Tailwind CSS, Prisma ORM (MariaDB), Framer Motion, dan Sharp untuk image processing.

## User Review Required

> [!IMPORTANT]
> **Database**: Pastikan MariaDB/MySQL sudah berjalan lokal dan Anda memiliki database kosong yang siap digunakan. Setelah project dibuat, Anda perlu mengisi `.env` dengan `DATABASE_URL` yang valid sebelum menjalankan `prisma db push`.

> [!WARNING]
> **Admin Auth**: Implementasi menggunakan `next-auth` dengan CredentialsProvider (username + bcrypt password). Ini berarti session rahasia (`NEXTAUTH_SECRET`) harus diset di `.env`.

> [!NOTE]
> **Audio**: Karena browser memblokir autoplay audio tanpa interaksi user, audio hanya akan dijalankan saat user klik tombol "Buka Undangan" — ini sesuai spesifikasi.

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] Project root initialized with:
- `npx create-next-app@latest ./ --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- Dependencies: `framer-motion`, `prisma`, `@prisma/client`, `next-auth`, `bcryptjs`, `sharp`, `@types/bcryptjs`

---

### 2. Database & ORM

#### [NEW] [schema.prisma](file:///d:/Projek/undanganForYou/prisma/schema.prisma)
Models: `Admin`, `Invitation`, `Image` (ImagePosition enum: HERO, BRIDE, GROOM, GALLERY_ITEM), `Comment`

#### [NEW] [prisma/client.ts](file:///d:/Projek/undanganForYou/lib/prisma.ts)
Singleton Prisma client untuk Next.js

---

### 3. Configuration & Design System

#### [NEW] [tailwind.config.ts](file:///d:/Projek/undanganForYou/tailwind.config.ts)
Custom palette: `gold` (#D4AF37), `charcoal` (#1A1A1A), `offwhite` (#FAF9F6), font families (Playfair Display + Inter)

#### [NEW] [app/globals.css](file:///d:/Projek/undanganForYou/app/globals.css)
CSS variables, Bali ornament divider patterns via SVG mask, scrollbar styling, glassmorphism utilities

#### [NEW] [app/layout.tsx](file:///d:/Projek/undanganForYou/app/layout.tsx)
Root layout dengan Google Fonts (Playfair Display, Inter), metadata default

---

### 4. Core Invitation Components

#### [NEW] [components/invitation/Cover.tsx](file:///d:/Projek/undanganForYou/components/invitation/Cover.tsx)
- Full-screen welcome overlay
- Framer Motion fade-in + slide animations
- Membaca `?to=` query param untuk nama tamu
- Tombol "Buka Undangan" → `audio.play()` + fade-out overlay + enable scroll

#### [NEW] [components/invitation/Countdown.tsx](file:///d:/Projek/undanganForYou/components/invitation/Countdown.tsx)
- Hitung mundur: Hari, Jam, Menit, Detik
- Glassmorphism card
- `AnimatePresence` + flip animation untuk angka berubah

#### [NEW] [components/invitation/VideoScroll.tsx](file:///d:/Projek/undanganForYou/components/invitation/VideoScroll.tsx)
- Intersection Observer (threshold 50%)
- Lazy load YouTube iframe (hanya render saat masuk viewport)
- `muted=1&autoplay=1` saat visible
- Thumbnail placeholder sebelum load

#### [NEW] [components/invitation/MapsSection.tsx](file:///d:/Projek/undanganForYou/components/invitation/MapsSection.tsx)
- Tampilan alamat dengan tipografi rapi
- Lazy iframe Google Maps embed
- Tombol CTA "Buka Petunjuk Jalan" → deep link `mapsUrl`

#### [NEW] [components/invitation/GuestBook.tsx](file:///d:/Projek/undanganForYou/components/invitation/GuestBook.tsx)
- Form: Nama, Ucapan, Kehadiran (radio: Hadir / Tidak Hadir)
- Server Action `submitComment` dengan `revalidatePath`
- `useFormStatus` untuk loading state
- List komentar terbaru (live update)

#### [NEW] [components/invitation/BaliDivider.tsx](file:///d:/Projek/undanganForYou/components/invitation/BaliDivider.tsx)
- SVG ornamen Patra-style pembatas section

---

### 5. Invitation Page (Dynamic Route)

#### [NEW] [app/[slug]/page.tsx](file:///d:/Projek/undanganForYou/app/[slug]/page.tsx)
- Fetch invitation by slug dari Prisma
- Passing data ke semua components
- `?to=` query param diteruskan ke `Cover`
- Susunan: Cover → Hero Image → Couple Info → Countdown → Detail Acara → Video → Galeri → Maps → GuestBook

---

### 6. Server Actions

#### [NEW] [app/actions/comment.ts](file:///d:/Projek/undanganForYou/app/actions/comment.ts)
- `submitComment(formData, invitationId)` → Prisma create + revalidatePath

---

### 7. Admin Panel

#### [NEW] [app/admin/login/page.tsx](file:///d:/Projek/undanganForYou/app/admin/login/page.tsx)
Login form dengan NextAuth signIn

#### [NEW] [app/admin/dashboard/page.tsx](file:///d:/Projek/undanganForYou/app/admin/dashboard/page.tsx)
List semua undangan dengan link edit/preview

#### [NEW] [app/admin/invitations/new/page.tsx](file:///d:/Projek/undanganForYou/app/admin/invitations/new/page.tsx)
#### [NEW] [app/admin/invitations/[id]/edit/page.tsx](file:///d:/Projek/undanganForYou/app/admin/invitations/[id]/edit/page.tsx)
Form buat/edit undangan (slug, nama mempelai, tanggal, alamat, mapsUrl, youtubeVideoId, musicUrl)

#### [NEW] [app/admin/invitations/[id]/images/page.tsx](file:///d:/Projek/undanganForYou/app/admin/invitations/[id]/images/page.tsx)
Upload gambar dengan pilihan posisi (HERO / BRIDE / GROOM / GALLERY_ITEM)

#### [NEW] [app/api/upload/route.ts](file:///d:/Projek/undanganForYou/app/api/upload/route.ts)
- Menerima multipart/form-data
- Proses dengan Sharp: convert WebP, resize max 1200px
- Simpan ke `/public/uploads/[slug]/`
- Simpan record ke tabel Image

#### [NEW] [lib/auth.ts](file:///d:/Projek/undanganForYou/lib/auth.ts)
NextAuth config dengan CredentialsProvider + bcrypt compare

---

## Verification Plan

### Automated (Dev Server)
```bash
# Start dev server
npm run dev
```

### Manual Verification Steps

1. **Invitation Page**
   - Buka `http://localhost:3000/[slug]?to=Nama+Tamu`
   - Verifikasi nama tamu muncul di Cover
   - Klik "Buka Undangan" → audio mulai, overlay hilang, scroll aktif
   - Scroll ke section Countdown → hitung mundur berjalan
   - Scroll ke section Video → iframe YouTube autoplay + muted
   - Klik "Buka Petunjuk Jalan" → membuka Google Maps

2. **GuestBook**
   - Isi form nama, ucapan, kehadiran → submit
   - Verifikasi data muncul di list tanpa full reload

3. **Admin Panel**
   - Buka `http://localhost:3000/admin/login`
   - Login dengan kredensial admin
   - Buat undangan baru, upload gambar dengan posisi HERO
   - Verifikasi gambar muncul di halaman undangan

4. **Image Processing**
   - Upload gambar JPEG/PNG → verifikasi tersimpan sebagai `.webp` di `/public/uploads/`
