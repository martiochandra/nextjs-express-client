# Tugas Mandiri - REST API Manajemen Buku & Mahasiswa

Proyek ini dibuat untuk memenuhi tugas praktikum Pemrograman Web / Backend Dasar menggunakan Express.js, TypeScript, dan MySQL manual (tanpa ORM).

## Fitur Proyek
1. **CRUD Mahasiswa**: Menggunakan simulasi memori Array dengan fitur pencarian dan validasi duplikasi NIM.
2. **Manajemen Buku**: Menggunakan database MySQL manual dengan implementasi arsitektur bertingkat (Controller-Repository Pattern).
3. **Relasi Database (One-to-Many)**: Menggunakan query `LEFT JOIN` manual untuk menghubungkan tabel `buku` dan `kategori`.
4. **Global Error Handling**: Middleware terpusat untuk menangkap error server dan database (seperti duplikasi data).

## Struktur Tabel MySQL (`db_kampus`)
```sql
CREATE TABLE kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    kategori_id INT,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id)
);