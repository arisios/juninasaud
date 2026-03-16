const pool = require('../db/pool');

async function validateProducerScope(req, res, next) {
  try {
    const producerId = req.headers['x-producer-id'];

    if (!producerId) {
      return res.status(400).json({ error: 'producer header missing' });
    }

    const producerCheck = await pool.query(
      'SELECT id FROM producers WHERE id = $1',
      [producerId]
    );

    if (producerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'invalid producer' });
    }

    req.producerId = producerId;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
}

module.exports = { validateProducerScope };
