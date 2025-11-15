import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      console.log("Mengirim data register:", { nama: name, email, password, role });
      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        {
          nama: name,
          email: email,
          password: password,
          role: role,
        }
      );
      console.log("Response dari server:", response.data);
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error saat register:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      if (err.code === "ERR_NETWORK" || err.message === "Network Error" || err.message.includes("Network")) {
        setError("Tidak dapat terhubung ke server. Pastikan server backend berjalan di http://localhost:3001");
      } else if (err.response) {
        // Server merespons dengan error
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
      } else if (err.request) {
        // Request dibuat tapi tidak ada response
        setError("Server tidak merespons. Pastikan backend berjalan di http://localhost:3001");
      } else {
        setError(err.message || "Terjadi kesalahan saat registrasi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Mendaftar..." : "Register"}
          </button>
        </form>
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mt-4 text-center">{success}</p>
        )}
        <p className="text-center mt-4 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

