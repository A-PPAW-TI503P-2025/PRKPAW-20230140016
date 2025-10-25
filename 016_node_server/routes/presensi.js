'use strict';
const {
  Model
} = require('sequelize');
const express = require('express');
const router = express.Router();
const { Presensi } = require('../models'); // gunakan model yang sudah diinisialisasi

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true, // Boleh null
    }
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};

router.get('/', async (req, res) => {
  try {
    const rows = await Presensi.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, nama, checkIn, checkOut } = req.body;
    const created = await Presensi.create({ userId, nama, checkIn, checkOut });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/check-in', async (req, res) => {
  console.log('headers:', req.headers);
  console.log('body:', req.body); // debug: lihat apa masuk
  const { userId, nama } = req.body || {};
  if (!userId || !nama) return res.status(400).json({ error: 'userId and nama required' });

  const created = await Presensi.create({
    userId,
    nama,
    checkIn: new Date(),
    checkOut: null
  });
  res.status(201).json(created);
});

router.post('/check-out', async (req, res) => {
  try {
    console.log('body:', req.body);
    const userId = req.body?.userId ?? req.query?.userId;
    const id = req.body?.id ?? req.query?.id;
    if (!userId && !id) return res.status(400).json({ error: 'userId or id required' });

    // cari record open check-in (prioritaskan id jika diberikan)
    const where = id
      ? { id: Number(id) }
      : { userId: Number(userId), checkOut: null };

    const presensi = await Presensi.findOne({
      where,
      order: [['checkIn', 'DESC']]
    });

    if (!presensi) return res.status(404).json({ error: 'no open check-in found' });

    presensi.checkOut = new Date();
    await presensi.save();
    res.json(presensi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
