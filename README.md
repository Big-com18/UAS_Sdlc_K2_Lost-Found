# Campus Lost & Found — Sprint P12: US1, US8, US6 (13/14 poin)

Hanya 3 story dari Revised Sprint Backlog P12 yang dibuat, dengan **tampilan Mahasiswa dan Petugas Security terpisah**
(tombol di kanan atas). US2, US3, US4, US5, US7 sengaja belum dibuat (sprint berikutnya).

## Petugas Security
- **Catat Barang Temuan (US1)** — jenis, waktu & lokasi ditemukan, deskripsi, pihak yang menyerahkan, lokasi penyimpanan. Catatan bisa dibuka lagi dan menampilkan lokasi penyimpanan.
- **Klaim Masuk (US6 + US8)** — bandingkan bukti dari mahasiswa dengan catatan barang, lalu **Setujui** atau **Tolak** (alasan wajib).
- **Barang Temuan** — rincian lengkap, daftar klaim, catat klaim langsung di pos, dan **Tandai Dikembalikan**.
- Isi nama di kolom **Petugas** (atas halaman); nama itu dicatat sebagai pemverifikasi.

## Mahasiswa
- **Barang Temuan** — daftar sederhana (id, jenis, tanggal; high-value disamarkan) hanya sebagai titik masuk untuk mengajukan klaim. Mahasiswa mengisi ciri-ciri/isi barang; barang high-value mendapat **kode klaim**.
- **Klaim Saya** — status klaim: menunggu / disetujui / ditolak (dengan alasan) / sudah diserahkan.

## Aturan penyerahan
`Tandai Dikembalikan` hanya berhasil jika ada klaim yang **disetujui** petugas; berlaku untuk semua barang (US6).
Barang bernilai tinggi (Dompet, Smartphone, Laptop, Kartu Identitas, atau ditandai manual) mendapat banner penahanan + kode klaim (US8).
Aturan dijaga di `markReturned()`, bukan hanya tombol. Saat barang dikembalikan, klaim lain untuk barang itu otomatis ditolak.

## Menjalankan
```bash
npm install
npm run dev
npm test
```
Atau ganti folder `src/` di proyek Vite-mu.

## Asumsi (bukan fakta stakeholder)
- Tanpa login; nama petugas & mahasiswa diisi manual (otorisasi staf = P10 Q4, Open).
- Pengajuan klaim oleh mahasiswa adalah cara memasukkan "bukti kepemilikan" agar verifikasi petugas punya data; P10 belum mendefinisikannya (cara verifikasi = Q3, Q10, Open).
- Kode klaim hanya untuk high-value (judul US8 di P11). Definisi high-value masih Open (Q2).
- Acceptance criteria US8 belum ada di P10; ditulis saat refinement (P12 bagian D).
