"use client";

import { useState, useEffect } from "react";
import { getToken, getUser, logout } from "../../lib/auth";
import Link from "next/link";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

 

  // Ambil daftar user dari API Backend
  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  };

   // Ambil data user admin dari LocalStorage
   useEffect(() => {
    const activeUser = getUser();
    setCurrentUser(activeUser);
    
    if (activeUser?.role === "admin") {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Fungsi Reset Password User oleh Admin
  const handleResetPassword = async (id: number, name: string) => {
    const konfirmasi = confirm(`Apakah Anda yakin ingin mereset password untuk ${name}?`);
    if (!konfirmasi) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/api/users/${id}/reset-password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      if (response.ok) {
        alert(`🔑 PASSWORD BERHASIL DIRESET!\n\nPassword sementara untuk ${name} adalah:\n${result.temporaryPassword}\n\n*Catatan: Harap catat password ini, hanya ditampilkan sekali.`);
      } else {
        alert(result.message || "Gagal mereset password");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi server saat reset password.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-gray-500">Memuat data pengguna...</div>;
  }

  // Proteksi antarmuka jika yang mencoba masuk bukan Admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-red-500 font-bold text-lg">Akses Ditolak</h1>
        <p className="text-gray-600 text-sm mt-1 mb-4">Halaman ini khusus untuk administrator.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Manajemen Pengguna (User)</h1>
            <p className="text-xs text-gray-500">Mode Kontrol Otomatis: <span className="font-bold text-red-600">ADMINISTRATOR</span></p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300">
              📁 Data Mahasiswa
            </Link>
            <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
              Keluar
            </button>
          </div>
        </div>

        {/* Tabel Data User */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3">Email Pengguna</th>
                <th className="px-4 py-3">Hak Akses (Role)</th>
                <th className="px-4 py-3 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-700">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      item.role === 'admin' ? 'bg-red-100 text-red-700' : 
                      item.role === 'operator' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button 
                      onClick={() => handleResetPassword(item.id, item.name)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
                    >
                      🔄 Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}