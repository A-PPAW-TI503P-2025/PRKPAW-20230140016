const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    // Pastikan req.user ada
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User ID tidak ditemukan dalam token." });
    }

    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    console.log("Mencoba Check-In untuk UserID:", userId); // Debug Log

    // Cek apakah sudah checkin tapi belum checkout
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini (belum check-out).",
      });
    }

    // Buat record baru
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude, // <-- Simpan ke database
      longitude: longitude, // <-- Simpan ke database
    });

    // Ambil data user untuk response
    const user = await User.findByPk(userId);

    const formattedData = {
      id: newRecord.id,
      userId: newRecord.userId,
      nama: user ? user.nama : "Unknown",
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${
        user ? user.nama : ""
      }, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", {
        timeZone,
      })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckIn:", error); // Tampilkan error lengkap di terminal server
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat Check-In.",
      error: error.message, // Kirim pesan error spesifik ke frontend
      detail: error, // Kirim objek error lengkap (opsional, untuk dev)
    });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "User ID tidak ditemukan dalam token." });
    }

    const { id: userId } = req.user;
    const waktuSekarang = new Date();

    console.log("Mencoba Check-Out untuk UserID:", userId); // Debug Log

    // Cari data checkin aktif
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message:
          "Tidak ditemukan catatan check-in yang aktif untuk Anda. Silakan Check-In terlebih dahulu.",
      });
    }

    // Update checkout
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const user = await User.findByPk(userId);

    const formattedData = {
      id: recordToUpdate.id,
      userId: recordToUpdate.userId,
      nama: user ? user.nama : "Unknown",
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
    };

    res.json({
      message: `Selamat jalan ${
        user ? user.nama : ""
      }, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckOut:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat Check-Out",
      error: error.message,
    });
  }
};

// ... sisa fungsi delete dan update tidak berubah signifikan, tapi bagusnya ditambahkan try-catch serupa.
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
