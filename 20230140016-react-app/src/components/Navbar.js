import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cek apakah kita sedang di halaman auth (login/register)
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo selalu tampil, tapi link-nya bisa diatur */}
            <Link
              to={user && !isAuthPage ? "/dashboard" : "/login"}
              className="text-xl font-bold text-blue-600 flex items-center gap-2"
            >
              <span>🎓</span>
              <span>Portal Akademik</span>
            </Link>

            {/* Menu Navigasi: Hanya tampil jika user login DAN BUKAN di halaman auth */}
            {user && !isAuthPage && (
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                <Link
                  to="/presensi"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Presensi
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/reports"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    <span>📊</span> Laporan Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Tombol Logout / User Info: Hanya tampil jika user login DAN BUKAN di halaman auth */}
            {user && !isAuthPage ? (
              <>
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.nama}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Tombol Login/Register: Tampil jika belum login ATAU sedang di halaman auth */
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/login"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/register"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
