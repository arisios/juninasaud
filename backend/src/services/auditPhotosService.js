const pool = require('../db/pool');

async function saveAuditPhotos(auditId, files) {

  if (!files || files.length === 0) {
    return;
  }

  const client = await pool.connect();

  try {

    for (const file of files) {

      await client.query(
        `
        INSERT INTO audit_photos
        (audit_session_id, photo_path)
        VALUES ($1,$2)
        `,
        [
          auditId,
          file.filename
        ]
      );

    }

  } catch (err) {
    console.error("error saving audit photos", err);
    throw err;
  } finally {
    client.release();
  }

}

module.exports = {
  saveAuditPhotos
};
