# The Beginning of Forever — Wedding Invitation Template

Template undangan digital one-page bergaya editorial, mengikuti referensi screenshot: nuansa charcoal, foto full-screen, overlay gelap, tipografi serif, menu hamburger, countdown, detail acara, galeri, gift, RSVP, dan halaman penutup.

## Cara menjalankan
1. Extract ZIP.
2. Buka folder proyek.
3. Jalankan `index.html` di browser. Untuk pengembangan, disarankan memakai extension **Live Server** di VS Code.

## Bagian yang wajib diganti
Edit `js/config.js`:
- `names`: nama kedua mempelai.
- `date`: tanggal dan jam countdown. Gunakan ISO 8601 beserta zona waktu, contoh `2027-01-12T10:00:00+08:00` untuk Bali/WITA.
- `dateLabel`: tulisan tanggal yang tampil.
- `events`: tanggal, waktu, alamat, dan tautan Google Maps.
- `gift`: bank, nomor rekening, dan nama pemilik rekening.
- `whatsappNumber`: nomor WhatsApp tujuan RSVP, format internasional tanpa `+`.
- `images` dan `gallery`: URL foto. Ganti dengan foto milik sendiri yang sudah diunggah ke hosting/CDN.

## Catatan penting
- Foto contoh memakai URL Unsplash dan membutuhkan koneksi internet. Ganti dengan foto pasangan sendiri untuk hasil final.
- RSVP membuka WhatsApp dengan teks yang sudah diisi; tidak menyimpan data ke database.
- Font Google Fonts juga membutuhkan koneksi internet.
- Tanggal dan nama contoh hanya placeholder. Pastikan semua data acara, rekening, dan nomor WhatsApp benar sebelum dipublikasikan.
- Link Google Maps pada contoh merupakan lokasi contoh; sesuaikan dengan venue sebenarnya.

## Struktur
- `index.html` — struktur halaman.
- `css/style.css` — desain responsif dan animasi.
- `js/config.js` — seluruh data yang mudah diedit.
- `js/main.js` — menu, countdown, copy rekening, RSVP, dan reveal on scroll.
