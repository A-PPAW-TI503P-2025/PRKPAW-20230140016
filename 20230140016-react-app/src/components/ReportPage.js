import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda belum login (Token tidak ditemukan).");
      setLoading(false);
      return;
    }

    try {
      // Sesuaikan endpoint dengan backend Anda
      // Biasanya GET /api/presensi untuk admin mengambil semua data
      const response = await axios.get("http://localhost:3001/api/presensi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Pastikan struktur response data sesuai (response.data.data atau response.data)
      setReportData(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.response?.data?.message || "Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Laporan Presensi Seluruh Pegawai
            </h2>
            <button
              onClick={fetchReportData}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Refresh Data
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Memuat data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Belum ada data presensi yang terekam.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jam Masuk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jam Pulang
                      </th>
                      {/* Kolom Baru: Latitude & Longitude */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latitude
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Longitude
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.user ? item.user.nama : "User Tidak Dikenal"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {item.userId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(item.checkIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(item.checkIn)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.checkOut ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {formatTime(item.checkOut)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Belum Check-out
                            </span>
                          )}
                        </td>

                        {/* Menampilkan Data Lokasi */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {item.latitude || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {item.longitude || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
