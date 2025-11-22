import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const PresensiPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handlePresensi = async (type) => {
    setLoading(true);
    setMessage("");
    setError("");

    const token = getToken();
    if (!token) {
      setError("Anda belum login. Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const endpoint = type === "check-in" ? "/check-in" : "/check-out";
    const url = `http://localhost:3001/api/presensi${endpoint}`;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Body kosong karena backend mengambil userId dari token
      const response = await axios.post(url, {}, config);

      setMessage(response.data.message);
    } catch (err) {
      console.error("Error details:", err);
      const errorMsg =
        err.response?.data?.message || err.message || `Gagal melakukan ${type}`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Presensi Harian
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Silakan lakukan Check-In saat datang dan Check-Out saat pulang.
            </p>
          </div>

          {/* Notifikasi Sukses */}
          {message && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Berhasil!</p>
              <p>{message}</p>
            </div>
          )}

          {/* Notifikasi Error */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Gagal!</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={() => handlePresensi("check-in")}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                🕒
              </span>
              {loading ? "Memproses..." : "Check-In"}
            </button>

            <button
              onClick={() => handlePresensi("check-out")}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                🚪
              </span>
              {loading ? "Memproses..." : "Check-Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresensiPage;
