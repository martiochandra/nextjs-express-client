"use client";

import { useState, useEffect } from "react";
// Sesuaikan path import utilitas auth milikmu
import { getToken, logout, getUser } from "../lib/auth"; 

export default function DashboardPage() {
  // Set default state sebagai null
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Pastikan kode dieksekusi setelah komponen terpasang di client browser
    setIsClient(true);
    const loggedInUser = getUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Set aturan kondisional hak akses tombol berdasarkan modul
  const role = user?.role;
  const canCreate = role === "admin" || role === "operator";
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  // Mencegah kesalahan hidrasi Next.js saat memproses LocalStorage di server-side
  if (!isClient) {
    return <div className="p-8 text-center text-sm text-gray-500">Memuat Sesi...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Manajemen Data Mahasiswa</h1>
            <p className="text-xs text-gray-500">
              Masuk sebagai:{" "}
              {role ? (
                <span className="font-bold text-blue-600 uppercase">{role}</span>
              ) : (
                <span className="text-red-500 italic">Sesi Tidak Ditemukan (Silakan Login Ulang)</span>
              )}
              {user?.email && ` (${user.email})`}
            </p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            Keluar
          </button>
        </div>

        {/* 1. TOMBOL TAMBAH MAHASISWA (Hanya Muncul untuk Admin & Operator)[cite: 1] */}
        {canCreate && (
          <button 
            onClick={() => alert("Fungsi Tambah Data Dipanggil (Scope Modul Selanjutnya)")} 
            className="mb-4 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors"
          >
            ➕ Tambah Mahasiswa
          </button>
        )}

        {/* Tabel Data Mahasiswa */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Prodi</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">10102030</td>
                <td className="px-4 py-3">Ahmad Faisal</td>
                <td className="px-4 py-3">Informatika</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  
                  {/* 2. TOMBOL EDIT (Hanya Muncul untuk Admin & Operator)[cite: 1] */}
                  {canEdit && (
                    <button 
                      onClick={() => alert("Fungsi Edit Dipanggil")}
                      className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 transition-colors"
                    >
                      Edit
                    </button>
                  )}

                  {/* 3. TOMBOL HAPUS (Hanya Muncul untuk Admin)[cite: 1] */}
                  {canDelete && (
                    <button 
                      onClick={() => alert("Fungsi Hapus Dipanggil")}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                  
                  {/* Teks Pengganti jika dia hanya Viewer[cite: 1] */}
                  {!canEdit && !canDelete && (
                    <span className="text-xs italic text-gray-400">Hanya Lihat</span>
                  )}

                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}