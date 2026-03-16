const pool = require('../db/pool');

exports.resolve = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid)
      return res.status(400).json({ error: 'uid required' });

    const result = await pool.query(
      `SELECT b.*, e.closed,
              CASE
                WHEN b.finalized = true THEN 'FINAL'
                WHEN b.last_audit_at IS NULL THEN 'OPENING_PENDING'
                ELSE 'PERIODIC_ALLOWED'
              END AS status
       FROM booths b
       JOIN events e ON b.event_id = e.id
       WHERE b.nfc_uid = $1`,
      [uid]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'booth not found' });

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
