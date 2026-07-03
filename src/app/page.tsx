"use client";

import { useState, useEffect } from "react";

// Definisikan tipe data sesuai dengan yang dikirim backend
interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
}

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // 1. Fungsi untuk mengambil seluruh data mahasiswa dari MySQL
  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/mahasiswa`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      
      const result = await res.json();
      setMahasiswa(result.data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi untuk menangani pencarian (Search)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      fetchMahasiswa(); // Jika input kosong, tampilkan semua data kembali
      return;
    }

    try {
      setLoading(true);
      // Menembak endpoint search versi database atau array
      const res = await fetch(`${apiUrl}/mahasiswa/search/${keyword}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Pencarian gagal");
      }

      setMahasiswa(result.data);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setMahasiswa([]);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data pertama kali saat halaman dimuat
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-blue-600">Dashboard Akademik</h1>
          <p className="text-gray-500 mt-1">Integrasi Frontend Next.js & Backend Express.js TypeScript</p>
        </header>

        {/* Kontrol / Filter Pencarian */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama (min. 3 karakter)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => { setKeyword(""); fetchMahasiswa(); }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Penanganan Pesan Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tampilan Tabel Data */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-medium animate-pulse">
              Sedang memuat data dari API Express...
            </div>
          ) : mahasiswa.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-medium">
              Tidak ada data mahasiswa ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
                    <th className="py-4 px-6">No</th>
                    <th className="py-4 px-6">NIM</th>
                    <th className="py-4 px-6">Nama Lengkap</th>
                    <th className="py-4 px-6">Program Studi</th>
                    <th className="py-4 px-6">Angkatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {mahasiswa.map((mhs, idx) => (
                    <tr key={mhs.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-400">{idx + 1}</td>
                      <td className="py-4 px-6 font-mono text-blue-600 font-medium">{mhs.nim}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{mhs.nama}</td>
                      <td className="py-4 px-6 text-gray-600">{mhs.prodi}</td>
                      <td className="py-4 px-6 text-gray-500">{mhs.angkatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}