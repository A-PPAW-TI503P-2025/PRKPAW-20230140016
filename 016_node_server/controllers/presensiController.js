const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const userIdPart = req.user?.id || "anon";
    // pastikan extname dipakai sehingga filename selalu punya ekstensi
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${userIdPart}-${Date.now()}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  // accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.checkIn = async (req, res) => {
  try {
    console.log("checkIn req.file:", req.file);
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User tidak terautentikasi" });

    const { latitude, longitude } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Foto (field 'photo') harus diunggah" });
    }

    const filename = req.file.filename;
    const presensi = await Presensi.create({
      userId,
      latitude,
      longitude,
      status: "in",
      buktiFoto: req.file ? req.file.filename : null,
      checkIn: format(new Date(), "yyyy-MM-dd HH:mm:ss", { timeZone }),
    });

    console.log("checkIn saved presensi.buktiFoto:", presensi.buktiFoto);
    return res.status(201).json({ message: "Check-in berhasil", presensi });
  } catch (err) {
    console.error("checkIn error:", err);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat check-in", error: err.message });
  }
};

exports.getAllPresensi = async (req, res) => {
  try {
    const presensiData = await Presensi.findAll({
      attributes: [
        "id",
        "userId",
        "checkIn",
        "checkOut",
        "latitude",
        "longitude",
        "buktiFoto",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email", "role"],
        },
      ],
      order: [["checkIn", "DESC"]],
    });

    const plain = presensiData.map((p) => (p.toJSON ? p.toJSON() : p));
    return res.json({ data: plain });
  } catch (error) {
    console.error("getAllPresensi error:", error);
    return res
      .status(500)
      .json({ message: "Gagal mengambil data presensi", error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User tidak terautentikasi" });

    const { latitude, longitude } = req.body;

    // cari record check-in terakhir yang belum di-checkout
    const presensi = await Presensi.findOne({
      where: { userId, checkOut: null },
      order: [["checkIn", "DESC"]],
    });

    if (!presensi) {
      return res.status(400).json({
        message: "Tidak ditemukan data check-in yang dapat di-checkout",
      });
    }

    // update fields (photo optional)
    if (req.file) presensi.buktiFoto = req.file.filename;
    if (latitude !== undefined) presensi.latitude = latitude;
    if (longitude !== undefined) presensi.longitude = longitude;

    presensi.checkOut = format(new Date(), "yyyy-MM-dd HH:mm:ss", { timeZone });
    presensi.status = "out";

    await presensi.save();

    return res.json({ message: "Check-out berhasil", presensi });
  } catch (err) {
    console.error("checkOut error:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan saat check-out",
      error: err.message,
    });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin && recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();
    res.status(200).json({
      message: "Catatan presensi berhasil dihapus.",
      data: { id: presensiId },
    });
  } catch (error) {
    console.error("Error Delete:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (checkIn) recordToUpdate.checkIn = new Date(checkIn);
    if (checkOut) recordToUpdate.checkOut = new Date(checkOut);

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    console.error("Error Update:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Fungsi untuk meng-handle upload foto bukti presensi
