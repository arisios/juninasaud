// App State
const app = {
  currentScreen: 'login',
  currentEvent: null,
  exhibitors: [],
  booths: [],
  events: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  showScreen('login');
  checkToken();
});

// Check if user is logged in
function checkToken() {
  const token = getToken();
  if (token) {
    showScreen('dashboard');
  }
}

// Screen Navigation
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show selected screen
  const screen = document.getElementById(screenName);
  if (screen) {
    screen.classList.add('active');
    app.currentScreen = screenName;
    
    // Load data for specific screens
    if (screenName === 'dashboard') {
      loadEvents();
    } else if (screenName === 'event-dashboard') {
      loadBooths();
    } else if (screenName === 'create-booth') {
      loadExhibitors();
    }
  }
}

// ===== LOGIN SCREEN =====
function handleLogin(event) {
  event.preventDefault();
  
  const name = document.getElementById('login-name').value.trim();
  const password = document.getElementById('login-password').value.trim();
  
  if (!name || !password) {
    showAlert('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  const loginBtn = event.target.querySelector('button');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Autenticando...';
  
  apiLogin(name, password).then(result => {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
    
    if (result.success) {
      showAlert('Login realizado com sucesso!', 'success');
      document.getElementById('login-name').value = '';
      document.getElementById('login-password').value = '';
      showScreen('dashboard');
    } else {
      showAlert('Erro: ' + result.error, 'error');
    }
  });
}

// ===== DASHBOARD SCREEN =====
function loadEvents() {
  const container = document.getElementById('events-list');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando eventos...</div>';
  
  apiGetEvents().then(result => {
    if (result.success) {
      app.events = result.data;
      renderEvents();
    } else {
      container.innerHTML = '<div class="alert alert-error">Erro ao carregar eventos: ' + result.error + '</div>';
    }
  });
}

function renderEvents() {
  const container = document.getElementById('events-list');
  
  if (!app.events || app.events.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">Nenhum evento criado ainda</div></div>';
    return;
  }
  
  let html = '';
  app.events.forEach(event => {
    html += `
      <div class="event-card">
        <div class="event-name">${escapeHtml(event.name)}</div>
        <div class="event-date">${formatDate(event.created_at)}</div>
        <button class="btn-primary btn-small" onclick="openEvent('${event.id}')">
          Abrir Evento
        </button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function openEvent(eventId) {
  const event = app.events.find(e => e.id === eventId);
  if (event) {
    app.currentEvent = event;
    document.getElementById('event-title').textContent = event.name;
    showScreen('event-dashboard');
  }
}

function goBackToDashboard() {
  app.currentEvent = null;
  showScreen('dashboard');
}

// ===== CREATE EVENT SCREEN =====
function handleCreateEvent(event) {
  event.preventDefault();
  
  const name = document.getElementById('event-name').value.trim();
  
  if (!name) {
    showAlert('Por favor, digite o nome do evento', 'error');
    return;
  }
  
  const btn = event.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Criando...';
  
  apiCreateEvent(name).then(result => {
    btn.disabled = false;
    btn.textContent = 'Criar Evento';
    
    if (result.success) {
      showAlert('Evento criado com sucesso!', 'success');
      document.getElementById('event-name').value = '';
      loadEvents();
      showScreen('dashboard');
    } else {
      showAlert('Erro: ' + result.error, 'error');
    }
  });
}

function goToCreateEvent() {
  showScreen('create-event');
}

// ===== CREATE EXHIBITOR SCREEN =====
function handleCreateExhibitor(event) {
  event.preventDefault();
  
  const name = document.getElementById('exhibitor-name').value.trim();
  
  if (!name) {
    showAlert('Por favor, digite o nome do expositor', 'error');
    return;
  }
  
  const btn = event.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Criando...';
  
  apiCreateExhibitor(name).then(result => {
    btn.disabled = false;
    btn.textContent = 'Criar Expositor';
    
    if (result.success) {
      showAlert('Expositor criado com sucesso!', 'success');
      document.getElementById('exhibitor-name').value = '';
      loadExhibitors();
      showScreen('event-dashboard');
    } else {
      showAlert('Erro: ' + result.error, 'error');
    }
  });
}

function goToCreateExhibitor() {
  showScreen('create-exhibitor');
}

// ===== EVENT DASHBOARD SCREEN =====
function loadBooths() {
  if (!app.currentEvent) return;
  
  const container = document.getElementById('booths-list');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Carregando barracas...</div>';
  
  apiGetBooths(app.currentEvent.id).then(result => {
    if (result.success) {
      app.booths = result.data;
      renderBooths();
    } else {
      container.innerHTML = '<div class="alert alert-error">Erro ao carregar barracas: ' + result.error + '</div>';
    }
  });
}

function renderBooths() {
  const container = document.getElementById('booths-list');
  
  if (!app.booths || app.booths.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏪</div><div class="empty-state-text">Nenhuma barraca criada ainda</div></div>';
    return;
  }
  
  let html = '';
  app.booths.forEach(booth => {
    const statusClass = getStatusClass(booth.status);
    const statusText = getStatusText(booth.status);
    
    html += `
      <div class="booth-card ${statusClass}">
        <div class="booth-name">${escapeHtml(booth.booth_name)}</div>
        <div class="booth-exhibitor">Expositor: ${escapeHtml(booth.exhibitor_name || 'N/A')}</div>
        <div class="booth-status">Status: ${statusText}</div>
        <button class="btn-primary btn-small" onclick="goToWithdrawal('${booth.id}')">
          Registrar Sangria
        </button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function getStatusClass(status) {
  if (!status) return 'status-ok';
  
  status = status.toLowerCase();
  if (status === 'ok') return 'status-ok';
  if (status === 'attention') return 'status-attention';
  if (status === 'delay') return 'status-delay';
  if (status === 'final') return 'status-final';
  
  return 'status-ok';
}

function getStatusText(status) {
  if (!status) return '✓ OK';
  
  status = status.toLowerCase();
  if (status === 'ok') return '✓ OK';
  if (status === 'attention') return '⚠ Atenção';
  if (status === 'delay') return '✗ Atraso';
  if (status === 'final') return '✓ Finalizada';
  
  return '✓ OK';
}

// ===== CREATE BOOTH SCREEN =====
function loadExhibitors() {
  apiGetExhibitors().then(result => {
    if (result.success) {
      app.exhibitors = result.data;
      renderExhibitorSelect();
    } else {
      showAlert('Erro ao carregar expositores: ' + result.error, 'error');
    }
  });
}

function renderExhibitorSelect() {
  const select = document.getElementById('booth-exhibitor');
  select.innerHTML = '<option value="">-- Selecione um expositor --</option>';
  
  app.exhibitors.forEach(exhibitor => {
    const option = document.createElement('option');
    option.value = exhibitor.id;
    option.textContent = exhibitor.name;
    select.appendChild(option);
  });
}

function handleCreateBooth(event) {
  event.preventDefault();
  
  const boothName = document.getElementById('booth-name').value.trim();
  const exhibitorId = document.getElementById('booth-exhibitor').value;
  const auditInterval = document.getElementById('booth-audit-interval').value.trim();
  const nfcUid = document.getElementById('booth-nfc-uid').value.trim();
  
  if (!boothName || !exhibitorId || !auditInterval || !nfcUid) {
    showAlert('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  const btn = event.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Criando...';
  
  apiCreateBooth(app.currentEvent.id, exhibitorId, boothName, parseInt(auditInterval), nfcUid).then(result => {
    btn.disabled = false;
    btn.textContent = 'Criar Barraca';
    
    if (result.success) {
      showAlert('Barraca criada com sucesso!', 'success');
      document.getElementById('booth-name').value = '';
      document.getElementById('booth-exhibitor').value = '';
      document.getElementById('booth-audit-interval').value = '';
      document.getElementById('booth-nfc-uid').value = '';
      loadBooths();
      showScreen('event-dashboard');
    } else {
      showAlert('Erro: ' + result.error, 'error');
    }
  });
}

function goToCreateBooth() {
  showScreen('create-booth');
}

// ===== WITHDRAWAL SCREEN =====
function goToWithdrawal(boothId) {
  const booth = app.booths.find(b => b.id === boothId);
  if (booth) {
    document.getElementById('withdrawal-booth-id').value = boothId;
    document.getElementById('withdrawal-booth-name').textContent = booth.booth_name;
    showScreen('withdrawal');
  }
}

function handleWithdrawal(event) {
  event.preventDefault();
  
  const boothId = document.getElementById('withdrawal-booth-id').value;
  const amount = document.getElementById('withdrawal-amount').value.trim();
  const reason = document.getElementById('withdrawal-reason').value.trim();
  
  if (!amount || !reason) {
    showAlert('Por favor, preencha todos os campos', 'error');
    return;
  }
  
  const btn = event.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Registrando...';
  
  apiCreateWithdrawal(boothId, parseFloat(amount), reason).then(result => {
    btn.disabled = false;
    btn.textContent = 'Registrar Sangria';
    
    if (result.success) {
      showAlert('Sangria registrada com sucesso!', 'success');
      document.getElementById('withdrawal-amount').value = '';
      document.getElementById('withdrawal-reason').value = '';
      loadBooths();
      showScreen('event-dashboard');
    } else {
      showAlert('Erro: ' + result.error, 'error');
    }
  });
}

// ===== LOGOUT =====
function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    apiLogout();
    app.currentEvent = null;
    app.exhibitors = [];
    app.booths = [];
    app.events = [];
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
    showScreen('login');
  }
}

// ===== UTILITY FUNCTIONS =====
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const main = document.querySelector('main');
  main.insertBefore(alertDiv, main.firstChild);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

// Prevent form submission on Enter in certain fields
document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
    const form = event.target.closest('form');
    if (form) {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      }
    }
  }
});
