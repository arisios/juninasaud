// API Configuration
const API_BASE = "http://192.168.0.33:3000";

// Utility function to decode JWT and extract producer_id
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Get producer_id from JWT
function getProducerId() {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded ? decoded.id : null;
}

// Set authorization header
function getHeaders(authenticated = false) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (authenticated) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// API Methods

// LOGIN
async function apiLogin(name, password) {
  try {
    const response = await fetch(`${API_BASE}/producers/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: name,
        password: password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro no login: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      return { success: true, token: data.token };
    }
    
    return { success: false, error: 'Token não recebido' };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: error.message };
  }
}

// GET EVENTS
async function apiGetEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return { success: false, error: error.message };
  }
}

// CREATE EVENT
async function apiCreateEvent(name) {
  try {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        name: name
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar evento: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return { success: false, error: error.message };
  }
}

// CREATE EXHIBITOR
async function apiCreateExhibitor(name) {
  try {
    const producerId = getProducerId();
    if (!producerId) {
      throw new Error('producer_id não encontrado no token');
    }
    
    const response = await fetch(`${API_BASE}/exhibitors`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        producer_id: producerId,
        name: name
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar expositor: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao criar expositor:', error);
    return { success: false, error: error.message };
  }
}

// GET EXHIBITORS
async function apiGetExhibitors() {
  try {
    const response = await fetch(`${API_BASE}/exhibitors`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar expositores: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao buscar expositores:', error);
    return { success: false, error: error.message };
  }
}

// CREATE BOOTH
async function apiCreateBooth(eventId, exhibitorId, boothName, auditIntervalMinutes, nfcUid) {
  try {
    const response = await fetch(`${API_BASE}/opening`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        event_id: eventId,
        exhibitor_id: exhibitorId,
        booth_name: boothName,
        audit_interval_minutes: auditIntervalMinutes,
        nfc_uid: nfcUid
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar barraca: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao criar barraca:', error);
    return { success: false, error: error.message };
  }
}

// GET BOOTHS BY EVENT
async function apiGetBooths(eventId) {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}/booths`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar barracas: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao buscar barracas:', error);
    return { success: false, error: error.message };
  }
}

// CREATE WITHDRAWAL
async function apiCreateWithdrawal(boothId, amount, reason) {
  try {
    const response = await fetch(`${API_BASE}/withdrawals`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        booth_id: boothId,
        amount: amount,
        reason: reason
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao registrar sangria: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Erro ao registrar sangria:', error);
    return { success: false, error: error.message };
  }
}

// LOGOUT
function apiLogout() {
  localStorage.removeItem('token');
}
