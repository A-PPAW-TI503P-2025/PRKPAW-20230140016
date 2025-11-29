const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
// Gunakan authenticateToken bukan addUserData
const { authenticateToken } = require("../middleware/permissionMiddleware");
const { body, validationResult } = require("express-validator");

// Contoh di routes
const reportController = require("../controllers/reportController");
// ... middleware auth ...
router.get("/", authenticateToken, reportController.getReport);

// Terapkan middleware autentikasi untuk semua route presensi
router.use(authenticateToken);

// Route Check-in
// URL Akhir: POST /api/presensi/check-in
router.post("/check-in", authenticateToken, presensiController.CheckIn);

// Route Check-out
// URL Akhir: POST /api/presensi/check-out
router.post("/check-out", authenticateToken, presensiController.CheckOut);

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
      // Mapping nama field dari request body ke field database
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

router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
