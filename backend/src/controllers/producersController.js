const { withTransaction } = require('../db/transaction');
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password)
      return res.status(400).json({ error: 'name and password required' });

    const hash = await bcrypt.hash(password, 10);

    const result = await withTransaction(async (client) => {
      const insert = await client.query(
        'INSERT INTO producers (name, password) VALUES ($1,$2) RETURNING id,name,created_at',
        [name, hash]
      );
      return insert.rows[0];
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM producers WHERE name = $1',
      [name]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'invalid credentials' });

    const producer = result.rows[0];

    const valid = await bcrypt.compare(password, producer.password);

    if (!valid)
      return res.status(401).json({ error: 'invalid credentials' });

    const token = generateToken({
      id: producer.id,
      name: producer.name,
      role: 'producer'
    });

    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
