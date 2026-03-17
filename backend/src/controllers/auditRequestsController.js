const pool = require('../db/pool');

// Cria um novo pedido de auditoria (produtor)
exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { booth_id, scheduled_for, notes } = req.body || {};

    if (!booth_id)
      return res.status(400).json({ error: 'booth_id required' });

    // Garante que a barraca pertence a um evento do produtor logado
    const boothCheck = await pool.query(
      `SELECT b.id
       FROM booths b
       JOIN events e ON b.event_id = e.id
       WHERE b.id = $1 AND e.producer_id = $2`,
      [booth_id, req.user.id]
    );

    if (boothCheck.rows.length === 0)
      return res.status(403).json({ error: 'invalid scope' });

    const insert = await pool.query(
      `INSERT INTO audit_requests
        (booth_id, requested_by_producer_id, scheduled_for, notes, status)
       VALUES ($1,$2,$3,$4,'PENDING')
       RETURNING *`,
      [
        booth_id,
        req.user.id,
        scheduled_for || null,
        notes || null,
      ]
    );

    return res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error('auditRequests.create error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

// Lista pedidos do produtor (opcionalmente filtrando por evento)
exports.listForProducer = async (req, res) => {
  try {
    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { event_id } = req.query;

    const params = [req.user.id];
    let where = 'ar.requested_by_producer_id = $1';

    if (event_id) {
      where += ' AND b.event_id = $2';
      params.push(event_id);
    }

    const result = await pool.query(
      `SELECT ar.*, b.name AS booth_name, e.name AS event_name
       FROM audit_requests ar
       JOIN booths b ON ar.booth_id = b.id
       JOIN events e ON b.event_id = e.id
       WHERE ${where}
       ORDER BY COALESCE(ar.scheduled_for, ar.created_at) DESC`,
      params
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('auditRequests.listForProducer error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

// Fila de pedidos para o auditor
exports.queueForAuditor = async (req, res) => {
  try {
    if (req.user.role !== 'auditor')
      return res.status(403).json({ error: 'forbidden' });

    const result = await pool.query(
      `SELECT ar.*, b.name AS booth_name, e.name AS event_name
       FROM audit_requests ar
       JOIN booths b ON ar.booth_id = b.id
       JOIN events e ON b.event_id = e.id
       WHERE ar.status = 'PENDING'
         AND e.producer_id = $1
       ORDER BY COALESCE(ar.scheduled_for, ar.created_at) ASC`,
      [req.user.producer_id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('auditRequests.queueForAuditor error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

// Aceitar um pedido (auditor pega para si)
exports.accept = async (req, res) => {
  try {
    if (req.user.role !== 'auditor')
      return res.status(403).json({ error: 'forbidden' });

    const { id } = req.params;

    const update = await pool.query(
      `UPDATE audit_requests
       SET status = 'IN_PROGRESS',
           accepted_by_auditor_id = $1,
           accepted_at = NOW()
       WHERE id = $2
         AND status = 'PENDING'
       RETURNING *`,
      [req.user.id, id]
    );

    if (update.rows.length === 0)
      return res.status(404).json({ error: 'not found or not pending' });

    return res.json(update.rows[0]);
  } catch (err) {
    console.error('auditRequests.accept error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

// Marcar pedido como concluído (após auditoria feita)
exports.complete = async (req, res) => {
  try {
    if (req.user.role !== 'auditor')
      return res.status(403).json({ error: 'forbidden' });

    const { id } = req.params;

    const update = await pool.query(
      `UPDATE audit_requests
       SET status = 'DONE',
           completed_at = NOW()
       WHERE id = $1
         AND (status = 'PENDING' OR status = 'IN_PROGRESS')
       RETURNING *`,
      [id]
    );

    if (update.rows.length === 0)
      return res.status(404).json({ error: 'not found or already completed' });

    return res.json(update.rows[0]);
  } catch (err) {
    console.error('auditRequests.complete error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

