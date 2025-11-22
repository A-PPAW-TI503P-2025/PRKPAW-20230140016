const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = {
      // Include tabel User untuk mendapatkan nama dan email
      include: [
        {
          model: User,
          as: "User",
          attributes: ["nama", "email"],
          where: {}, // Untuk filter nama
        },
      ],
      where: {}, // Untuk filter tanggal presensi
    };

    // Filter berdasarkan Nama User
    if (nama) {
      options.include[0].where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // Filter rentang tanggal Presensi
    if (tanggalMulai || tanggalSelesai) {
      const start = tanggalMulai ? new Date(tanggalMulai) : null;
      const end = tanggalSelesai ? new Date(tanggalSelesai) : null;

      if (start && !isNaN(start)) start.setHours(0, 0, 0, 0);
      if (end && !isNaN(end)) end.setHours(23, 59, 59, 999);

      if (start && end) {
        options.where.checkIn = { [Op.between]: [start, end] };
      } else if (start) {
        options.where.checkIn = { [Op.gte]: start };
      } else if (end) {
        options.where.checkIn = { [Op.lte]: end };
      }
    }

    const records = await Presensi.findAll(options);

    res.json({
      message: "Laporan berhasil diambil.",
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
