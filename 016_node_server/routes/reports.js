const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
// Import middleware autentikasi & otorisasi yang benar
const {
  authenticateToken,
  isAdmin,
} = require("../middleware/permissionMiddleware");

// Route dilindungi: harus login (authenticateToken) dan role admin (isAdmin)
router.get(
  "/daily",
  authenticateToken,
  isAdmin,
  reportController.getDailyReport
);

module.exports = router;
