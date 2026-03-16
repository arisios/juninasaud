
const API = "http://localhost:3000";

let token = localStorage.getItem("token");

async function login() {
  const nfc_uid = document.getElementById("nfc_uid").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auditors/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nfc_uid, password })
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

async function scanNFC() {
  const tag = document.getElementById("tag").value;

  const res = await fetch(`${API}/nfc/${tag}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    JSON.stringify(data, null, 2);
}

