import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";

function App() {
  return (
    <Router>
      {/* Navbar tidak dipanggil di sini secara global */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Halaman Utama */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
        <Route path="/reports" element={<ReportPage />} />

        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Fallback untuk halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
