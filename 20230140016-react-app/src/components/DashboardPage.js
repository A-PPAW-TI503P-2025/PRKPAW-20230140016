import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4 text-4xl">
              {getRoleIcon(userInfo.role)}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Selamat Datang, {userInfo.nama || "User"}!
              </h2>
              <p className="text-blue-100 text-lg">
                Anda telah berhasil masuk ke dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Role</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {userInfo.role === "admin" ? "Admin" : "Mahasiswa"}
                </p>
              </div>
              <div className="text-4xl">{getRoleIcon(userInfo.role)}</div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                  userInfo.role
                )}`}
              >
                {userInfo.role === "admin" ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          {/* User ID Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">User ID</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  #{userInfo.id}
                </p>
              </div>
              <div className="text-4xl">🆔</div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Status</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  Aktif
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-gray-800">View Reports</p>
                <p className="text-sm text-gray-600">Lihat laporan dan statistik</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold text-gray-800">Manage Data</p>
                <p className="text-sm text-gray-600">Kelola data dan informasi</p>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span>🚪</span>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
