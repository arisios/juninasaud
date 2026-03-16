const { withTransaction } = require('../db/transaction');
const { saveAuditPhotos } = require('../services/auditPhotosService');

exports.periodic = async (req, res) => {

  try {

    if (req.user.role !== 'auditor')
      return res.status(403).json({ error: 'forbidden' });

    const {
      booth_id,
      value_machine,
      value_cash,
      observation
    } = req.body;

    if (!booth_id || value_machine === undefined || value_cash === undefined)
      return res.status(400).json({ error: 'missing fields' });

    const value_total = Number(value_machine) + Number(value_cash);

    const result = await withTransaction(async (client) => {

      const boothCheck = await client.query(
        'SELECT b.*, e.producer_id FROM booths b JOIN events e ON b.event_id = e.id WHERE b.id = $1',
        [booth_id]
      );

      if (boothCheck.rows.length === 0)
        return res.status(404).json({ error: 'booth not found' });

      const booth = boothCheck.rows[0];

      if (!booth.audit_interval_minutes)
        return res.status(403).json({ error: 'periodic not configured for this booth' });

      if (booth.finalized)
        return res.status(403).json({ error: 'booth finalized' });

      if (booth.producer_id !== req.user.producer_id)
        return res.status(403).json({ error: 'invalid scope' });

      const insert = await client.query(
        'INSERT INTO audit_sessions (booth_id, auditor_id, audit_type, value_machine, value_cash, value_total, observation) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [
          booth_id,
          req.user.id,
          'PERIODIC',
          value_machine,
          value_cash,
          value_total,
          observation || null
        ]
      );

      await client.query(
        'UPDATE booths SET last_audit_at = now() WHERE id = $1',
        [booth_id]
      );

      const audit = insert.rows[0];

      if (req.files && req.files.length > 0) {
        await saveAuditPhotos(audit.id, req.files);
      }

      return audit;

    });

    return res.status(201).json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }

};
