const { withTransaction } = require('../db/transaction');
const pool = require('../db/pool');

exports.create = async (req, res) => {
  try {
    const { producer_id, name } = req.body;
    if (!producer_id || !name)
      return res.status(400).json({ error: 'producer_id and name required' });

    const result = await withTransaction(async (client) => {
      const insert = await client.query(
        'INSERT INTO exhibitors (producer_id, name) VALUES ($1,$2) RETURNING *',
        [producer_id, name]
      );
      return insert.rows[0];
    });

    return res.status(201).json(result);
  } catch {
    return res.status(500).json({ error: 'Internal error' });
  }
};

exports.list = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exhibitors ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch {
    return res.status(500).json({ error: 'Internal error' });
  }
};
