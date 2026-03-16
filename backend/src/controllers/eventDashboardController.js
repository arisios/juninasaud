const pool = require('../db/pool');
const { calculateStatus } = require('../services/statusService');

exports.dashboard = async (req, res) => {
  try {

    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { event_id } = req.params;

    const eventCheck = await pool.query(
      'SELECT id FROM events WHERE id = $1 AND producer_id = $2',
      [event_id, req.user.id]
    );

    if (eventCheck.rows.length === 0)
      return res.status(403).json({ error: 'invalid scope' });

    const result = await pool.query(
      'SELECT * FROM booths WHERE event_id = $1',
      [event_id]
    );

    let summary = {
      total: 0,
      green: 0,
      yellow: 0,
      red: 0,
      final: 0
    };

    result.rows.forEach(booth => {

      summary.total++;

      const status = calculateStatus(booth);

      if (status === 'GREEN') summary.green++;
      else if (status === 'YELLOW') summary.yellow++;
      else if (status === 'RED') summary.red++;
      else if (status === 'FINAL') summary.final++;
    });

    return res.json(summary);

  } catch {
    return res.status(500).json({ error: 'internal error' });
  }
};
