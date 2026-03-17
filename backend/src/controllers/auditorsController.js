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

// Lista auditores do produtor, marcando se estão vinculados ao evento
exports.listForEvent = async (req, res) => {
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
      `SELECT a.id,
              a.name,
              a.nfc_uid,
              a.active,
              a.created_at,
              (ea.auditor_id IS NOT NULL) AS linked
       FROM auditors a
       LEFT JOIN event_auditors ea
         ON ea.auditor_id = a.id
        AND ea.event_id = $2
       WHERE a.producer_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id, event_id]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

// Vincula auditor a evento
exports.attachToEvent = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { event_id } = req.params;
    const { auditor_id } = req.body || {};

    if (!auditor_id)
      return res.status(400).json({ error: 'auditor_id required' });

    const eventCheck = await pool.query(
      'SELECT id FROM events WHERE id = $1 AND producer_id = $2',
      [event_id, req.user.id]
    );

    if (eventCheck.rows.length === 0)
      return res.status(403).json({ error: 'invalid scope' });

    const auditorCheck = await pool.query(
      'SELECT id FROM auditors WHERE id = $1 AND producer_id = $2',
      [auditor_id, req.user.id]
    );

    if (auditorCheck.rows.length === 0)
      return res.status(404).json({ error: 'auditor not found' });

    await pool.query(
      `INSERT INTO event_auditors (event_id, auditor_id)
       VALUES ($1,$2)
       ON CONFLICT (event_id, auditor_id) DO NOTHING`,
      [event_id, auditor_id]
    );

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};

// Eventos ativos ligados a este auditor (via event_auditors)
exports.myEvents = async (req, res) => {
  try {
    if (req.user.role !== 'auditor')
      return res.status(403).json({ error: 'forbidden' });

    const result = await pool.query(
      `SELECT e.*
       FROM event_auditors ea
       JOIN events e ON ea.event_id = e.id
       WHERE ea.auditor_id = $1
         AND e.producer_id = $2
         AND e.closed = false
       ORDER BY e.created_at DESC`,
      [req.user.id, req.user.producer_id]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
