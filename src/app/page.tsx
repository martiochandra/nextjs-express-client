"use client";

import { useState, useEffect } from "react";

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
  const [successMessage, setSuccessMessage] = useState("");

  // State untuk menangani Input Form Tambah Mahasiswa Baru
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    prodi: "",
    angkatan: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // 1. Fungsi mengambil data mahasiswa dari backend
  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/mahasiswa`); // Menggunakan URL yang sudah kamu perbaiki tadi
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
      fetchMahasiswa();
      return;
    }

    try {
      setLoading(true);
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

  // 3. Fungsi untuk mengirimkan data Form Baru (POST Request)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validasi frontend sebelum menembak API
    if (!formData.nim || !formData.nama || !formData.prodi || !formData.angkatan) {
      setError("Semua field form wajib diisi!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/mahasiswa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal menambahkan mahasiswa baru");
      }

      // Jika berhasil:
      setSuccessMessage("Mahasiswa baru berhasil ditambahkan!");
      // Reset form input menjadi kosong kembali
      setFormData({ nim: "", nama: "", prodi: "", angkatan: "" });
      // Refresh data tabel agar mahasiswa yang baru langsung muncul
      fetchMahasiswa();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-blue-600">Dashboard Akademik</h1>
          <p className="text-gray-500 mt-1">Integrasi Input Form Frontend & Database MySQL Manual</p>
        </header>

        {/* Notifikasi Sukses / Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-sm text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6 text-sm text-green-700 font-medium">
            ✅ {successMessage}
          </div>
        )}

        {/* Pembagian Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM TAMBAH DATA (Baru - Modul 12) */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Tambah Mahasiswa Baru</h2>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">NIM</label>
                <input
                  type="text"
                  placeholder="Contoh: 2201003"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Program Studi</label>
                <input
                  type="text"
                  placeholder="Contoh: Informatika"
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Angkatan</label>
                <input
                  type="number"
                  placeholder="Contoh: 2022"
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
              >
                Simpan Mahasiswa
              </button>
            </form>
          </section>

          {/* KOLOM KANAN: PENCARIAN & TABEL DATA */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Box Fitur Pencarian */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Cari mahasiswa berdasarkan nama (min. 3 karakter)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cari
                  </button>
                  <button
                    type="button"
                    onClick={() => { setKeyword(""); fetchMahasiswa(); }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            {/* Tabel Data Mahasiswa */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-medium animate-pulse">
                  Sedang memperbarui data...
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
                        <th className="py-4 px-6">Prodi</th>
                        <th className="py-4 px-6">Angkatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {mahasiswa.map((mhs, idx) => (
                        <tr key={mhs.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-gray-400">{idx + 1}</td>
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
        </div>

      </div>
    </main>
  );
}