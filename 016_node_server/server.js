const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const path = require("path");

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const iotRoutes = require("./routes/iot");

// Routes baru dipanggil SETELAH baris di atas

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
const ruteBuku = require("./routes/books");
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
const presensiRouter = require("./routes/presensi");
app.use("/api/presensi", presensiRouter);

app.use("/api/iot", iotRoutes);
app.post("/api/iot/ping", (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
});
