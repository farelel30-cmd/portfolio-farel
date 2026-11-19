# 🌌 Cosmic Space Portfolio Website

Website portofolio interaktif bertema **Deep Space & Cosmic Glassmorphism** yang terinspirasi langsung dari konsep video yang Anda kirimkan. Didesain secara presisi agar tampil memukau di layar PC/Laptop dan **100% responsif serta sangat nyaman dilihat di HP / Mobile**.

---

## ✨ Fitur-Fitur Utama

1. **⚡ Loading Screen Sinematik**:
   - Efek sambaran petir elektrik dengan canvas animasi.
   - Progress bar dinamis dari 0% hingga 100%.
   - Transisi fade-out halus saat website siap.

2. **🌠 Background Luar Angkasa Interaktif**:
   - Bintang berkelap-kelip dengan efek kedalaman (depth parallax).
   - Shooting stars (bintang jatuh) berkala dengan ekor bercahaya.
   - Sambaran petir alami di latar belakang.
   - Dioptimalkan khusus agar tetap ringan dan mulus (60fps) di smartphone tanpa boros baterai.

3. **🤖 Floating Navbar dengan Maskot Melompat (Peeking Mascot)**:
   - Navigasi pill kaca melayang (`Home`, `About`, `Portfolio`, `Contact`).
   - Maskot lucu yang bergerak dan **melompat (hop animation)** mengikuti menu yang sedang aktif atau diklik.

4. **🎵 Daily Rotation (Pemutar Musik ala Spotify yang Benar-Benar Berfungsi)**:
   - Menampilkan album art, judul lagu, dan visualizer gelombang audio yang bergerak.
   - Ditenagai **Web Audio API** internal yang memutar musik instrumental lo-fi santai secara langsung di browser tanpa perlu file MP3 eksternal.
   - Kontrol Play / Pause, Next, Previous, Scrubber timeline, dan tombol *Save on Spotify*.

5. **👤 About Me & Avatar Holografik Spider-Man**:
   - Kartu profil interaktif: Klik avatar untuk beralih antara **Student Mode** dan **Spider-Man Mode** dengan efek scanline glitch!
   - Riwayat Pendidikan (Universitas Brawijaya, SMKN Winongan) & Pengalaman (Hology, GDG on Campus, Raion).
   - Counter angka dinamis (*Projects*, *Certificates*, *Awards*).

6. **📁 Portofolio Lengkap dengan Sub-Tabs**:
   - `</> Projects`: Grid proyek dengan modal popup detail, fitur utama, dan tautan live demo / GitHub.
   - `🎖️ Certificates`: Sertifikat lengkap dengan fitur lightbox fullscreen untuk melihat resolusi penuh.
   - `🏆 Awards`: Prestasi, medali, dan penghargaan.
   - `⚛️ Tech Stack`: Ikon teknologi modern (Node.js, React, Next.js, Tailwind, Supabase, Figma, dll).

7. **💬 Hubungi Saya & Buku Tamu Real-time (Guestbook / Komentar)**:
   - Formulir kirim pesan instan dengan notifikasi toast.
   - Kolom komentar / buku tamu langsung yang tersimpan di `localStorage` peramban (bisa tulis pesan, ganti nama, dan unggah foto profil).

---

## 📱 Optimasi Khusus HP / Smartphone

- **Fluid Typography**: Ukuran teks dan tombol otomatis menyesuaikan ukuran layar HP apapun (iPhone, Samsung, Xiaomi, dsb).
- **Thumb-Friendly Touch Targets**: Jarak klik tombol dan formulir dirancang nyaman untuk jari tangan.
- **Tanpa Geser Horizontal**: Tata letak terkunci rapi 100% tanpa ada overflow atau elemen terpotong.
- **Performa Ringan**: Dibuat murni dengan HTML5, CSS3, dan Vanilla JavaScript tanpa dependensi berat.

---

## 🚀 Cara Membuka Website

### Opsi 1: Buka Langsung di Browser
Cukup klik dua kali file [index.html](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/portfolio-space/index.html) untuk membukanya di browser favorit Anda (Chrome, Edge, Firefox, Safari).

### Opsi 2: Buka di HP Lewat Jaringan Lokal (Wi-Fi)
Jalankan server lokal melalui terminal:
```powershell
cd "C:\Users\LENOVO\.gemini\antigravity\scratch\portfolio-space"
python -m http.server 8080
```
Lalu buka alamat `http://<IP_KOMPUTER_ANDA>:8080` di browser HP Anda.

---

## 🛠️ Panduan Kustomisasi

- **Mengubah Biodata / Teks**: Buka file [index.html](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/portfolio-space/index.html) dan edit bagian teks nama, bio, atau tautan sosial media Anda.
- **Mengganti Foto Profil**: Ganti file `assets/images/avatar_normal.jpg` dan `assets/images/avatar_spider.jpg` dengan foto Anda sendiri.
- **Mengatur Warna & Efek**: Seluruh variabel warna dan efek cahaya dapat disesuaikan di bagian `:root` pada file [css/style.css](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/portfolio-space/css/style.css).
