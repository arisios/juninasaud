const pool = require('../db/pool');
const { calculateStatus } = require('../services/statusService');

exports.listByEvent = async (req, res) => {
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
      'SELECT * FROM booths WHERE event_id = $1 ORDER BY created_at ASC',
      [event_id]
    );

    const enriched = result.rows.map(booth => ({
      ...booth,
      status: calculateStatus(booth)
    }));

    return res.json(enriched);

  } catch {
    return res.status(500).json({ error: 'internal error' });
  }
};
