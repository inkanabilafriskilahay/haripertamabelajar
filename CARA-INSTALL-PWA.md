# 📱 Cara Install MISSKA sebagai PWA (Aplikasi HP)

## File yang dibutuhkan
```
📁 folder/
├── misska.html        ← Aplikasi utama
├── manifest.json      ← Konfigurasi PWA
├── sw.js              ← Service Worker (offline)
├── create-icons.html  ← Generator icon
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## LANGKAH 1 — Buat Icon

1. Buka file `create-icons.html` di browser
2. Klik tombol **"Generate & Download Semua Icon"**
3. Browser akan download 8 file PNG
4. Pindahkan semua file ke folder `icons/` (buat folder jika belum ada)

---

## LANGKAH 2 — Jalankan via Web Server

PWA **tidak bisa** diinstall dari `file://`. Harus menggunakan `http://`.

### Opsi A: VS Code Live Server (Paling Mudah)
1. Install VS Code extension: **Live Server** (oleh Ritwick Dey)
2. Klik kanan `misska.html` → **Open with Live Server**
3. Aplikasi terbuka di: `http://127.0.0.1:5500/misska.html`

### Opsi B: Python (jika sudah install Python)
```bash
cd "folder-misska"
python -m http.server 8080
```
Buka: `http://localhost:8080/misska.html`

### Opsi C: Upload ke Hosting
Upload semua file ke hosting gratis seperti:
- **Netlify** (netlify.com) — drag & drop folder
- **GitHub Pages** — gratis untuk file statis
- **Vercel** — gratis

---

## LANGKAH 3 — Install di HP Android

1. Buka Chrome di HP Android
2. Ketik alamat: `http://IP-KOMPUTER:5500/misska.html`
   - Cari IP komputer: buka CMD → ketik `ipconfig`
   - Contoh: `http://192.168.1.5:5500/misska.html`
3. Tunggu beberapa detik → muncul banner **"Install MISSKA"**
4. Klik **Install** → aplikasi terpasang di layar HP
5. Buka dari ikon di layar HP seperti aplikasi biasa ✅

---

## LANGKAH 4 — Install di Laptop/PC (Chrome)

1. Buka `misska.html` via Live Server di Chrome
2. Di address bar kanan atas, klik ikon **⊕ Install**
3. Klik **Install** → aplikasi terbuka di jendela sendiri

---

## Fitur Offline

Setelah diinstall, MISSKA bisa digunakan **tanpa internet** karena:
- Service Worker menyimpan cache aplikasi
- Semua data tersimpan di localStorage HP/laptop
- Hanya fitur import Excel yang butuh internet (CDN SheetJS)

---

## Akun Login Default

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |
| guru1    | pass123  | Guru |
| guru2    | pass456  | Guru |

> ⚠️ Ganti password setelah pertama login melalui menu **Profil Saya → Ganti Password**
