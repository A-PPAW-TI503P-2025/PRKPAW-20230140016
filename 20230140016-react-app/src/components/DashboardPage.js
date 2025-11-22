import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Gunakan Named Import
import Navbar from "./Navbar";

function DashboardPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? "👑" : "🎓";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4 text-4xl shadow-inner">
              {getRoleIcon(userInfo.role)}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Selamat Datang, {userInfo.nama || "User"}!
              </h2>
              <p className="text-blue-100 text-lg">
                Anda telah berhasil masuk ke dashboard sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Peran Pengguna
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
                  {userInfo.role}
                </p>
              </div>
              <div className="text-4xl opacity-80">
                {getRoleIcon(userInfo.role)}
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getRoleBadgeColor(
                  userInfo.role
                )}`}
              >
                {userInfo.role === "admin"
                  ? "Administrator"
                  : "Mahasiswa Aktif"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  User ID
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-2 font-mono">
                  #{userInfo.id}
                </p>
              </div>
              <div className="text-4xl opacity-80">🆔</div>
            </div>
            <div className="mt-4 text-xs text-gray-400">ID Unik Sistem</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Status Akun
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  Terverifikasi
                </p>
              </div>
              <div className="text-4xl opacity-80">✅</div>
            </div>
            <div className="mt-4 text-xs text-green-600 font-semibold">
              Akses Penuh Diberikan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
