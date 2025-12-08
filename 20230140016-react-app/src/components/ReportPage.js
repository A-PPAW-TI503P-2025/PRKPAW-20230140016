import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/presensi", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("raw report response:", response.data);

      const payload = response.data && (response.data.data || response.data);
      const arr = Array.isArray(payload) ? payload : [];

      const base = "http://localhost:3001/uploads";
      const normalized = arr.map((it) => {
        const plain = it.dataValues ? it.dataValues : it;
        // cari nama file di beberapa kemungkinan field
        let filename =
          plain.buktiFoto ||
          plain.photo ||
          plain.foto ||
          plain.fileName ||
          (plain.dataValues &&
            (plain.dataValues.buktiFoto || plain.dataValues.photo)) ||
          null;
        if (filename && !filename.includes(".")) filename = `${filename}.jpg`;

        const photoUrl = filename ? `${base}/${filename}` : null;
        return { ...plain, buktiFotoUrl: photoUrl, photoUrl };
      });

      setReportData(normalized);
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

  const openPreview = (url) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewImage(null);
    setPreviewOpen(false);
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

                        {/* Tombol Preview di kanan kolom lokasi */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {item.buktiFotoUrl ||
                          item.photoUrl ||
                          item.buktiFoto ||
                          item.photo ? (
                            <div className="flex justify-end">
                              <img
                                src={
                                  item.buktiFotoUrl ||
                                  item.photoUrl ||
                                  `http://localhost:3001/uploads/${
                                    item.buktiFoto || item.photo
                                  }`
                                }
                                alt="thumbnail"
                                className="w-14 h-14 object-cover rounded border cursor-pointer"
                                onClick={() =>
                                  openPreview(
                                    item.buktiFotoUrl ||
                                      item.photoUrl ||
                                      `http://localhost:3001/uploads/${
                                        item.buktiFoto || item.photo
                                      }`
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No Photo
                            </span>
                          )}
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

      {/* Modal preview */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded overflow-hidden max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[80vh] block"
            />
            <div className="p-2 text-right">
              <button
                onClick={closePreview}
                className="px-3 py-1 bg-gray-800 text-white rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
