-- Hapus semua record Image yang URL-nya tidak ada di daftar file yang ada di disk
DELETE FROM `Image`
WHERE url NOT IN (
  '/uploads/images/1775633158746-960132968.webp',
  '/uploads/images/1775633198062-436780919.webp',
  '/uploads/images/1775633221449-478992195.webp',
  '/uploads/images/1775633230260-612749164.webp',
  '/uploads/images/1775633265070-513888168.webp',
  '/uploads/images/1775633272690-577352112.webp',
  '/uploads/images/1775638131881-512-balinese-ornament-vector-logo-tatto-600nw-2447056739.webp',
  '/uploads/images/1775638353824-893891202.webp',
  '/uploads/music/1775635518632-683-RizkyFebianFeat.Mahalini-BermuaraOfficialLyricVideo.mp3'
);

-- Hapus coverUrl/musicUrl yang tidak ada di daftar file yang ada
UPDATE `Invitation`
SET coverUrl = NULL
WHERE coverUrl IS NOT NULL
  AND coverUrl NOT IN (
    '/uploads/images/1775633158746-960132968.webp',
    '/uploads/images/1775633198062-436780919.webp',
    '/uploads/images/1775633221449-478992195.webp',
    '/uploads/images/1775633230260-612749164.webp',
    '/uploads/images/1775633265070-513888168.webp',
    '/uploads/images/1775633272690-577352112.webp',
    '/uploads/images/1775638131881-512-balinese-ornament-vector-logo-tatto-600nw-2447056739.webp',
    '/uploads/images/1775638353824-893891202.webp'
  );

UPDATE `Invitation`
SET musicUrl = NULL
WHERE musicUrl IS NOT NULL
  AND musicUrl != '/uploads/music/1775635518632-683-RizkyFebianFeat.Mahalini-BermuaraOfficialLyricVideo.mp3';
