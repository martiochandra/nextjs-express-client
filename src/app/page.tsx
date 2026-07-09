"use client";

import { useState, useEffect } from "react";
import { getToken, logout, getUser } from "../lib/auth"; 
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil sesi login & muat list mahasiswa dari database
  useEffect(() => {
    setIsClient(true);
    const loggedInUser = getUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    fetchMahasiswa();
  }, []);

  // 2. Mengambil Semua Data Mahasiswa dari Database Backend
  const fetchMahasiswa = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Backend kamu mengembalikan data dalam properti 'data'
        setMahasiswaList(result.data || []);
      } else {
        console.error("Gagal mengambil data mahasiswa dari backend");
      }
    } catch (error) {
      console.error("Error fetchMahasiswa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fungsi Tambah Mahasiswa Terintegrasi database
  const handleTambah = async () => {
    const nim = prompt("Masukkan NIM Mahasiswa:");
    if (!nim) return;
    const nama = prompt("Masukkan Nama Mahasiswa:");
    if (!nama) return;
    const prodi = prompt("Masukkan Program Studi:");
    if (!prodi) return;
    const angkatan = prompt("Masukkan Angkatan (Contoh: 2024):");
    if (!angkatan) return;

    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/mahasiswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nim, nama, prodi, angkatan }),
      });

      const result = await response.json();
      alert(result.message);
      
      if (response.ok) {
        fetchMahasiswa(); // Segarkan tabel agar data baru langsung muncul
      }
    } catch (error) {
      console.error("Error handleTambah:", error);
    }
  };

  // 4. Fungsi Edit Mahasiswa Terintegrasi database
  const handleEdit = async (item: any) => {
    const nama = prompt("Ubah Nama Mahasiswa:", item.nama);
    if (!nama) return;
    const prodi = prompt("Ubah Program Studi:", item.prodi);
    if (!prodi) return;
    const angkatan = prompt("Ubah Angkatan Mahasiswa:", item.angkatan);
    if (!angkatan) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/mahasiswa/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nim: item.nim, nama, prodi, angkatan }),
      });

      const result = await response.json();
      alert(result.message);
      
      if (response.ok) {
        fetchMahasiswa(); // Segarkan tabel
      }
    } catch (error) {
      console.error("Error handleEdit:", error);
    }
  };

  // 5. Fungsi Hapus Mahasiswa Terintegrasi database
  const handleHapus = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) return;

    try {
      const token = getToken();
      // Pastikan URL mengarah tepat ke endpoint /api/mahasiswa/:id
      const response = await fetch(`http://localhost:5000/api/mahasiswa/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchMahasiswa(); // Segarkan tabel
      } else {
        alert(`Gagal menghapus! Pastikan rute DELETE di backend Anda adalah /api/mahasiswa/:id`);
      }
    } catch (error) {
      console.error("Error handleHapus:", error);
    }
  };

  // Konfigurasi Kondisional Hak Akses UI
  const role = user?.role;
  const canCreate = role === "admin" || role === "operator";
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  if (!isClient) {
    return <div className="p-8 text-center text-sm text-gray-500">Memuat Aplikasi...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Manajemen Data Mahasiswa</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">
                Masuk sebagai: <span className="font-bold text-blue-600 uppercase">{role || "GUEST"}</span>
              </p>
              {role === "admin" && (
                <Link href="/users" className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-semibold hover:bg-purple-200 transition-colors">
                  ⚙️ KELOLA USER
                </Link>
              )}
            </div>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            Keluar
          </button>
        </div>

        {/* Tombol Tambah Mahasiswa */}
        {canCreate && (
          <button 
            onClick={handleTambah} 
            className="mb-4 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors"
          >
            ➕ Tambah Mahasiswa
          </button>
        )}

        {/* Tabel Data Dinamis */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Prodi</th>
                <th className="px-4 py-3">Angkatan</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-400 italic">Memuat data mahasiswa...</td>
                </tr>
              ) : mahasiswaList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-400 italic">Belum ada data mahasiswa di database.</td>
                </tr>
              ) : (
                mahasiswaList.map((item) => (
                  <tr key={item.id} className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.nim}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.prodi}</td>
                    <td className="px-4 py-3">{item.angkatan}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      
                      {/* Tombol Edit */}
                      {canEdit && (
                        <button 
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 transition-colors"
                        >
                          Edit
                        </button>
                      )}

                      {/* Tombol Hapus */}
                      {canDelete && (
                        <button 
                          onClick={() => handleHapus(item.id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                      
                      {!canEdit && !canDelete && (
                        <span className="text-xs italic text-gray-400">Hanya Lihat</span>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}