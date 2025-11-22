import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Request ke endpoint report dengan filter nama
      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            nama: filterNama,
          },
        }
      );

      setReports(response.data.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal mengambil laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Baris komentar eslint-disable dihapus untuk mencegah error
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Laporan Presensi Harian
        </h1>

        {/* Search Filter */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Check-In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Check-Out
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length > 0 ? (
                    reports.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.User ? item.User.nama : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.checkIn).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.checkOut ? (
                            new Date(item.checkOut).toLocaleString("id-ID", {
                              timeZone: "Asia/Jakarta",
                            })
                          ) : (
                            <span className="text-yellow-600 italic">
                              Belum Check-out
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Tidak ada data presensi ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
