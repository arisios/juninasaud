
const API = "http://localhost:3000";
let token = localStorage.getItem("token");

async function login() {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/producers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    token = data.token;
    alert("Login OK");
  } else {
    alert("Erro login");
  }
}

async function loadEvents() {
  const res = await fetch(`${API}/events`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const events = await res.json();
  document.getElementById("events").innerText =
    JSON.stringify(events, null, 2);

  if (events.length > 0) {
    loadDashboard(events[0].id);
  }
}

async function loadDashboard(eventId) {
  const res = await fetch(`${API}/events/${eventId}/dashboard`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  document.getElementById("dashboard").innerText =
    JSON.stringify(data, null, 2);
}

