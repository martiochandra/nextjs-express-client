"use client";

import { useState, useEffect } from "react";

interface Buku {
  id: number;
  isbn: string;
  judul: string;
  penulis: string;
  stok: number;
  nama_kategori: string | null;
}

export default function BukuPage() {
  const [buku, setBuku] = useState<Buku[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State form buku baru
  const [formData, setFormData] = useState({
    isbn: "",
    judul: "",
    penulis: "",
    stok: "",
    kategori_id: "1", // Default ke kategori ID 1 (Teknologi)
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchBuku = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/buku`);
      if (!res.ok) throw new Error("Gagal mengambil data buku");
      const result = await res.json();
      setBuku(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/buku`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errResult = await res.json();
        throw new Error(errResult.message || "Gagal menambah buku");
      }

      setFormData({ isbn: "", judul: "", penulis: "", stok: "", kategori_id: "1" });
      fetchBuku();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBuku();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">Manajemen Buku</h1>
            <p className="text-gray-500 text-sm mt-1">Implementasi SQL Relational JOIN Manual</p>
          </div>
          <a href="/" className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            ⬅️ Kembali ke Mahasiswa
          </a>
        </header>

        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM INPUT BUKU */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Tambah Buku Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">ISBN</label>
                <input type="text" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="978-xxx" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Judul Buku</label>
                <input type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Judul" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Penulis</label>
                <input type="text" value={formData.penulis} onChange={(e) => setFormData({...formData, penulis: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nama penulis" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Stok</label>
                <input type="number" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kategori (Relasi Tabel)</label>
                <select value={formData.kategori_id} onChange={(e) => setFormData({...formData, kategori_id: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                  <option value="1">Teknologi</option>
                  <option value="2">Sains</option>
                  <option value="3">Novel / Sastra</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                Simpan Buku Relasi
              </button>
            </form>
          </section>

          {/* TABEL BUKU DENGAN KOLOM KATEGORI HARI JOIN */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Memuat relasi tabel...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase border-b">
                      <th className="py-4 px-6">ISBN</th>
                      <th className="py-4 px-6">Judul</th>
                      <th className="py-4 px-6">Kategori (JOIN)</th>
                      <th className="py-4 px-6">Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {buku.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-mono text-xs">{b.isbn}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{b.judul} <span className="text-xs text-gray-400 block font-normal">oleh {b.penulis}</span></td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.nama_kategori || "Tanpa Kategori"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-600">{b.stok} unit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}