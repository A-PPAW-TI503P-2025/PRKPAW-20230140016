const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const reportController = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/permissionMiddleware");
const { body, validationResult } = require("express-validator");

// gunakan upload dari controller
const upload = presensiController.upload;

// POST /api/presensi/check-in
router.post(
  "/check-in",
  authenticateToken,
  upload.single("photo"), // pastikan frontend pakai formData.append('photo', ...)
  presensiController.checkIn
);

// POST /api/presensi/check-out
router.post(
  "/check-out",
  authenticateToken,
  upload.single("photo"), // optional, jika checkout kirim foto juga
  presensiController.checkOut
);

// GET semua presensi / laporan (dilatih dengan autentikasi)
router.get("/", authenticateToken, reportController.getReport);

// PUT update presensi dengan validasi mapping waktu
router.put(
  "/:id",
  [
    body("waktuCheckIn")
      .optional()
      .isISO8601()
      .withMessage("waktuCheckIn harus berupa tanggal yang valid")
      .toDate(),
    body("waktuCheckOut")
      .optional()
      .isISO8601()
      .withMessage("waktuCheckOut harus berupa tanggal yang valid")
      .toDate(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (req.body.waktuCheckIn !== undefined) {
        req.body.checkIn = req.body.waktuCheckIn;
      }
      if (req.body.waktuCheckOut !== undefined) {
        req.body.checkOut = req.body.waktuCheckOut;
      }
      next();
    },
  ],
  presensiController.updatePresensi
);

// DELETE presensi
router.delete("/:id", authenticateToken, presensiController.deletePresensi);

module.exports = router;
