-- Adiciona estado (closed) aos eventos
ALTER TABLE events
ADD COLUMN IF NOT EXISTS closed BOOLEAN NOT NULL DEFAULT false;

-- Tabela de vínculo entre eventos e auditores
CREATE TABLE IF NOT EXISTS event_auditors (
  event_id UUID NOT NULL REFERENCES events(id),
  auditor_id UUID NOT NULL REFERENCES auditors(id),
  PRIMARY KEY (event_id, auditor_id)
);

