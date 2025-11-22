const jwt = require("jsonwebtoken"); // Tambahkan baris ini
const JWT_SECRET = "hpx128535!@#$%"; // Pastikan secret sama dengan di authController

exports.addUserData = (req, res, next) => {
  console.log("Middleware: Menambahkan data user dummy...");
  req.user = {
    id: 123,
    nama: "User Karyawan",
    role: "admin",
  };
  next();
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verify Error:", err.message); // Log error untuk debugging
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("Middleware: Izin admin diberikan.");
    next();
  } else {
    console.log("Middleware: Gagal! Pengguna bukan admin.");
    return res
      .status(403)
      .json({ message: "Akses ditolak: Hanya untuk admin" });
  }
};
