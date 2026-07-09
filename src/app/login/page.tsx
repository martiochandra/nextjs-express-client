"use client";
 
import { useState } from "react";
import { saveAuth } from "../../lib/auth";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
   
      const result = await response.json();
   
      if (!response.ok) {
        setError(result.message || "Login gagal");
        return;
      }
   
      // Simpan session ke localStorage jika sukses
      saveAuth(result.token, result.user);
      // Redirect ke halaman dashboard utama mahasiswa
      window.location.href = "/";
    } catch (err) {
      setError("Gagal terhubung ke server backend");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Dashboard Akademik</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Silakan masuk menggunakan akun Anda</p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 font-medium mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nama@email.com" 
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="******" 
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors pt-2"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}