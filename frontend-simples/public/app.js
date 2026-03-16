(function () {
  const storageKey = "audit_nfc_session";

  function setOut(msg) {
    const el = document.getElementById("out");
    if (el) el.textContent = msg || "";
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(storageKey, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(storageKey);
  }

  function decodeJwtPayload(token) {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(b64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  async function api(path, { method = "GET", token, json, formData } = {}) {
    const base = window.API_BASE || "http://localhost:3000";
    const url = base + path;
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (json) headers["Content-Type"] = "application/json";

    const res = await fetch(url, {
      method,
      headers,
      body: json ? JSON.stringify(json) : formData || undefined,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const errMsg =
        (data && data.error) ||
        (typeof data === "string" ? data : "Erro na requisição");
      throw new Error(`${res.status} ${errMsg}`);
    }
    return data;
  }

  async function loginFlow() {
    const loginEl = document.getElementById("login");
    const passEl = document.getElementById("password");

    const login = (loginEl ? loginEl.value : "").trim();
    const password = passEl ? passEl.value : "";

    if (!login || !password) {
      setOut("Preencha usuário e senha.");
      return;
    }

    setOut("Autenticando...");

    // 1ª tentativa: login como produtor
    try {
      const data = await api("/producers/login", {
        method: "POST",
        json: { name: login, password },
      });
      const payload = decodeJwtPayload(data.token) || {};
      setSession({ token: data.token, role: "producer", payload });
      // Em seguida vamos levar para uma página própria do produtor (a ser criada)
      window.location.href = "/producer.html";
      return;
    } catch (e) {
      // continua para tentar auditor
    }

    // 2ª tentativa: login como auditor
    const data = await api("/auditors/login", {
      method: "POST",
      json: { nfc_uid: login, password },
    });
    const payload = decodeJwtPayload(data.token) || {};
    setSession({ token: data.token, role: "auditor", payload });
    window.location.href = "/auditor.html";
  }

  function wireIndex() {
    const btn = document.getElementById("btnLogin");
    if (btn) {
      btn.addEventListener("click", () => {
        loginFlow().catch((e) => setOut(String(e.message || e)));
      });
    }
  }

  window.Front = {
    api,
    getSession,
    setSession,
    clearSession,
    decodeJwtPayload,
    setOut,
  };

  document.addEventListener("DOMContentLoaded", wireIndex);
})();

