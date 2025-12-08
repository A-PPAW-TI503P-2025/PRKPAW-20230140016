import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Webcam from "react-webcam";
import axios from "axios";
import Navbar from "./Navbar";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PresensiPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // Modifikasi handleCheckIn untuk mengirim lokasi
  const handleCheckIn = async () => {
    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }
    try {
      setLoading(true);
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      // harus 'photo'
      formData.append("photo", blob, "selfie.jpg");
      await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error(
        "Check-in error:",
        err.response?.data || err.message || err
      );
      setError(err.response?.data?.message || err.message || "Gagal check-in");
    } finally {
      setLoading(false);
    }
    // ...code lanjutan tidak diubah
  };

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

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/presensi", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("raw report response:", res.data);
      const payload =
        res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
      const arr = Array.isArray(payload) ? payload : [];
      const base = "http://localhost:3001/uploads";
      const normalized = arr.map((it) => {
        // handle possible nesting (dataValues) and different field names
        const plain = it.dataValues ? it.dataValues : it;
        const filename = plain.photo ?? plain.foto ?? null;
        return {
          ...plain,
          photoUrl: filename ? `${base}/${filename}` : null,
        };
      });
      setReportData(normalized);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.response?.data?.message || "Gagal mengambil data laporan.");
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

          {coords && (
            <div className="my-4 border rounded-lg overflow-hidden">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Lokasi Presensi Anda</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {/* Tampilan Kamera */}
          <div className="my-4 border rounded-lg overflow-hidden bg-black">
            {image ? (
              <img src={image} alt="Selfie" className="w-full" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            )}
          </div>

          <div className="mb-4">
            {!image ? (
              <button
                onClick={capture}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Ambil Foto 📸
              </button>
            ) : (
              <button
                onClick={() => setImage(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Foto Ulang 🔄
              </button>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleCheckIn}
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
