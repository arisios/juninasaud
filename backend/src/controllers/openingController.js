const { withTransaction } = require('../db/transaction');
const { saveAuditPhotos } = require('../services/auditPhotosService');

exports.opening = async (req, res) => {

  try {

    if (req.user.role !== 'auditor' && req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const {
      event_id,
      exhibitor_id,
      booth_name,
      audit_interval_minutes,
      nfc_uid
    } = req.body;

    if (!event_id || !exhibitor_id || !booth_name)
      return res.status(400).json({ error: 'missing fields' });

    const result = await withTransaction(async (client) => {

      const boothInsert = await client.query(
        `INSERT INTO booths
        (event_id, exhibitor_id, name, audit_interval_minutes, nfc_uid)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
          event_id,
          exhibitor_id,
          booth_name,
          audit_interval_minutes || null,
          nfc_uid || null
        ]
      );

      const booth = boothInsert.rows[0];

      const auditInsert = await client.query(
        `INSERT INTO audit_sessions
        (booth_id, auditor_id, audit_type, value_total)
        VALUES ($1,$2,'OPENING',0)
        RETURNING *`,
        [booth.id, req.user.id]
      );

      const audit = auditInsert.rows[0];

      const nfc_url = `http://192.168.0.33:3000/b/${booth.id}`;

      return {
        booth,
        audit,
        nfc_url
      };

    });

    return res.status(201).json(result);

  } catch (err) {

    console.error(err);

    return res.status(500).json({ error: 'internal error' });

  }

};
