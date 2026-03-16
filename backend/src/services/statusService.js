function calculateStatus(booth) {

  if (booth.finalized)
    return 'FINAL';

  // 🔵 SEM PERIÓDICO CONFIGURADO
  if (!booth.audit_interval_minutes)
    return 'GREEN';

  if (!booth.last_audit_at)
    return 'RED';

  const now = new Date();
  const last = new Date(booth.last_audit_at);
  const diffMinutes = (now - last) / 60000;

  if (diffMinutes < booth.audit_interval_minutes)
    return 'GREEN';

  if (diffMinutes < booth.audit_interval_minutes * 2)
    return 'YELLOW';

  return 'RED';
}

module.exports = { calculateStatus };
