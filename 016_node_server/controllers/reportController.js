const { Presensi, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getDailyReport = async (req, res) => {
  try {
    // optional ?date=YYYY-MM-DD (local date)
    const { date: dateParam } = req.query;
    const base = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();
    if (isNaN(base)) return res.status(400).json({ error: 'invalid date format' });

    const startOfDay = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    console.log('getDailyReport for', startOfDay.toISOString(), '->', startOfNextDay.toISOString());

    const records = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.gte]: startOfDay,
          [Op.lt]: startOfNextDay
        }
      },
      order: [['checkIn', 'ASC']]
    });

    res.json({
      reportDate: startOfDay.toISOString().split('T')[0],
      count: records.length,
      data: records
    });
  } catch (err) {
    console.error('getDailyReport error:', err);
    res.status(500).json({ error: err.message });
  }
};
