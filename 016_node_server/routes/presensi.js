const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');
router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put(
  '/:id',
  [
    body('waktuCheckIn')
      .optional()
      .isISO8601()
      .withMessage('waktuCheckIn harus berupa tanggal yang valid')
      .toDate(),
    body('waktuCheckOut')
      .optional()
      .isISO8601()
      .withMessage('waktuCheckOut harus berupa tanggal yang valid')
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
router.delete('/:id', presensiController.deletePresensi);
module.exports = router;
