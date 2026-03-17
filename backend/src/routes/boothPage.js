const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/b/:booth_id', async (req, res) => {

  try {

    const { booth_id } = req.params;

    const result = await pool.query(
      `SELECT b.id,b.name,e.name as event_name
       FROM booths b
       JOIN events e ON b.event_id = e.id
       WHERE b.id = $1`,
      [booth_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Barraca não encontrada');
    }

    const booth = result.rows[0];

    // Histórico básico de auditorias dessa barraca
    let audits = [];
    try {
      const auditsResult = await pool.query(
        `SELECT id, audit_type, value_machine, value_cash, value_total, observation, created_at
         FROM audit_sessions
         WHERE booth_id = $1
         ORDER BY created_at DESC`,
        [booth_id]
      );
      audits = auditsResult.rows || [];
    } catch (e) {
      audits = [];
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const nfcUrl = `${baseUrl}/b/${booth.id}`;

    res.send(`
<!DOCTYPE html>
<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${booth.name}</title>

      <style>

body{
font-family:Arial;
padding:20px;
background:#f2f2f2
}

.card{
background:white;
padding:20px;
border-radius:10px
}

input,textarea,button{
font-size:18px;
padding:10px;
margin-top:10px;
width:100%
}

</style>

</head>

<body>

<div class="card">

<h2>${booth.name}</h2>
<p>Evento: ${booth.event_name}</p>

<h3>Link NFC / QR desta barraca</h3>
<p>Use este link para configurar a tag NFC ou o QR code desta barraca.</p>
<input id="nfcLink" type="text" value="${nfcUrl}" readonly>
<button onclick="copyNfcLink()">Copiar link NFC</button>

<hr style="margin:20px 0">

<h3>Histórico de auditorias</h3>
<div id="audits"></div>

<p>
Use este link para que um auditor acesse esta barraca e registre novas
auditorias. Esta página é focada em <strong>consultar</strong> o histórico e,
se você estiver logado como produtor no sistema simples, também pode
<strong>solicitar auditorias</strong> para esta barraca.
</p>

<div id="producerActions" style="margin-top:20px; padding:12px; border-radius:10px; background:#eff6ff; border:1px solid #bfdbfe;">
  <h3>Pedidos de auditoria (produtor)</h3>
  <p id="producerInfo" style="margin:0 0 10px 0; font-size:14px; color:#1e40af;"></p>

  <button onclick="requestAuditNow()">Solicitar auditoria agora</button>

  <div style="margin-top:12px;">
    <label>Agendar auditoria para:</label>
    <input id="scheduleAt" type="datetime-local">
    <button onclick="requestAuditScheduled()">Agendar auditoria</button>
  </div>

  <pre id="requestsOut" style="margin-top:10px; font-size:12px; white-space:pre-wrap;"></pre>
</div>

</div>

<script>
const audits = ${JSON.stringify(audits || [])};

function renderAudits(){
  const container = document.getElementById('audits');
  if(!container) return;
  if(!audits || audits.length === 0){
    container.innerHTML = '<p>Nenhuma auditoria registrada para esta barraca ainda.</p>';
    return;
  }
  const parts = audits.map(a => {
    const when = a.created_at ? new Date(a.created_at).toLocaleString('pt-BR') : '';
    const type = a.audit_type || '';
    const total = a.value_total != null ? a.value_total : ( (Number(a.value_machine||0) + Number(a.value_cash||0)) );
    const obs = a.observation || '';
    return (
      '<div style="margin-bottom:10px;padding:8px;border-radius:8px;background:#f9fafb;border:1px solid #e5e7eb;">' +
      '<strong>Tipo:</strong> ' + type +
      (when ? '<br><strong>Data:</strong> ' + when : '') +
      '<br><strong>Valores:</strong> máquina ' + (a.value_machine ?? 0) + ', dinheiro ' + (a.value_cash ?? 0) +
      '<br><strong>Total:</strong> ' + total +
      (obs ? '<br><strong>Obs:</strong> ' + obs : '') +
      '</div>'
    );
  });
  container.innerHTML = parts.join('');
}

function getProducerSession(){
  try{
    const raw = localStorage.getItem('audit_nfc_session');
    if(!raw) return null;
    const s = JSON.parse(raw);
    if(!s || s.role !== 'producer' || !s.token) return null;
    return s;
  }catch(e){
    return null;
  }
}

async function requestAudit(body){
  const s = getProducerSession();
  const out = document.getElementById('requestsOut');
  if(!s){
    if(out) out.textContent = 'Sessão de produtor não encontrada. Faça login pelo frontend simples antes de abrir esta página.';
    alert('Sessão de produtor não encontrada. Faça login pelo frontend simples antes de abrir esta página.');
    return;
  }
  try{
    const res = await fetch('/audit-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + s.token
      },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let data;
    try{ data = text ? JSON.parse(text) : null; } catch{ data = text; }
    if(!res.ok){
      const msg = (data && data.error) || String(text || 'erro ao criar pedido');
      if(out) out.textContent = 'Erro ao criar pedido: ' + msg;
      alert('Erro ao criar pedido: ' + msg);
      return;
    }
    if(out) out.textContent = 'Pedido criado:\\n' + JSON.stringify(data, null, 2);
    alert('Pedido de auditoria criado com sucesso.');
  }catch(e){
    if(out) out.textContent = 'Erro de rede ao criar pedido: ' + (e.message || e);
    alert('Erro de rede ao criar pedido.');
  }
}

function requestAuditNow(){
  requestAudit({
    booth_id: "${booth.id}",
    notes: null
  });
}

function requestAuditScheduled(){
  const input = document.getElementById('scheduleAt');
  const when = input && input.value ? input.value : null;
  if(!when){
    alert('Informe uma data/hora para agendar.');
    return;
  }
  requestAudit({
    booth_id: "${booth.id}",
    scheduled_for: when,
    notes: null
  });
}

function initProducerBox(){
  const box = document.getElementById('producerActions');
  const info = document.getElementById('producerInfo');
  const s = getProducerSession();
  if(!box || !info) return;
  if(!s){
    info.textContent = 'Nenhuma sessão de produtor encontrada neste navegador. Você pode ver o histórico, mas para solicitar auditorias faça login primeiro no frontend simples.';
    return;
  }
  const payload = s.payload || {};
  info.textContent = 'Produtor logado: ' + (payload.name || '(sem nome)');
}

function copyNfcLink(){
  const input = document.getElementById('nfcLink');
  if(!input) return;
  input.select();
  input.setSelectionRange(0, 99999);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value)
      .then(() => alert("Link NFC copiado!"))
      .catch(() => alert("Não foi possível copiar automaticamente. Copie manualmente o texto."));
  } else {
    document.execCommand('copy');
    alert("Link NFC copiado!");
  }
}

renderAudits();
initProducerBox();
</script>

</body>
</html>
`);

  } catch (err) {
    res.status(500).send('Erro interno');
  }

});

module.exports = router;
