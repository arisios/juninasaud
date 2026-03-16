const { withTransaction } = require('../db/transaction');

exports.create = async (req, res) => {
  try {

    if (req.user.role !== 'producer')
      return res.status(403).json({ error: 'forbidden' });

    const { booth_id, amount, reason } = req.body;

    if (!booth_id || !amount)
      return res.status(400).json({ error: 'missing fields' });

    const result = await withTransaction(async (client) => {

      const boothCheck = await client.query(
        `
        SELECT b.id
        FROM booths b
        JOIN events e ON b.event_id = e.id
        WHERE b.id = $1 AND e.producer_id = $2
        `,
        [booth_id, req.user.id]
      );

      if (boothCheck.rows.length === 0)
        return res.status(403).json({ error: 'invalid scope' });

      const insert = await client.query(
        `
        INSERT INTO cash_withdrawals (booth_id, producer_id, amount, reason)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [booth_id, req.user.id, amount, reason || null]
      );

      return insert.rows[0];
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'internal error' });
  }
};
