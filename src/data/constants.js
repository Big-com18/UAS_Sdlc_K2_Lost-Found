// Konstanta domain Campus Lost & Found.
export const CATEGORIES = [
  'Dompet', 'Smartphone', 'Laptop', 'Kartu Identitas', 'Tumbler / Botol Minum',
  'Earphone', 'Buku Catatan', 'Payung', 'Kotak Pensil', 'Flashdisk', 'Kunci', 'Lainnya',
];

// P9 I3 / F3 / C4: contoh barang bernilai tinggi menurut Security.
// P10 Q2 / A5 (Open): definisi final belum ada; petugas juga bisa menandai manual.
export const HIGH_VALUE_CATEGORIES = ['Dompet', 'Smartphone', 'Laptop', 'Kartu Identitas'];

// US7 / P10 Q5 (Open): field yang boleh dilihat mahasiswa. Dibuat seminimal mungkin.
export const PUBLIC_ITEM_FIELDS = ['id', 'category', 'foundDate'];
export const MASKED_CATEGORY = 'Barang bernilai tinggi'; // P9 I4

export const ROLES = { STAFF: 'staff', STUDENT: 'student' };
