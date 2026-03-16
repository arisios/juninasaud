const { withTransaction } = require('../db/transaction');
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { producer_id, name, nfc_uid, password } = req.body;

    if (!producer_id || !name || !nfc_uid || !password)
      return res.status(400).json({ error: 'missing fields' });

    const hash = await bcrypt.hash(password, 10);

    const result = await withTransaction(async (client) => {
      const insert = await client.query(
        'INSERT INTO auditors (producer_id, name, nfc_uid, password) VALUES ($1,$2,$3,$4) RETURNING id,name,nfc_uid,active,created_at',
        [producer_id, name, nfc_uid, hash]
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
    const { nfc_uid, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM auditors WHERE nfc_uid = $1 AND active = true',
      [nfc_uid]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'invalid credentials' });

    const auditor = result.rows[0];

    const valid = await bcrypt.compare(password, auditor.password);

    if (!valid)
      return res.status(401).json({ error: 'invalid credentials' });

    const token = generateToken({
      id: auditor.id,
      producer_id: auditor.producer_id,
      role: 'auditor'
    });

    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

exports.listByProducer = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const result = await pool.query(
      'SELECT id, name, nfc_uid, active, created_at FROM auditors WHERE producer_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
