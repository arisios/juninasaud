const { withTransaction } = require('../db/transaction');
const pool = require('../db/pool');

exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: 'name required' });

    const result = await withTransaction(async (client) => {
      const insert = await client.query(
        'INSERT INTO events (producer_id, name) VALUES ($1,$2) RETURNING *',
        [req.user.id, name]
      );
      return insert.rows[0];
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

exports.listByProducer = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const result = await pool.query(
      'SELECT * FROM events WHERE producer_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    return res.json(result.rows);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

exports.getById = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND producer_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'not found' });

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
