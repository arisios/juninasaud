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
    const url = (window.UI_API_BASE || "") + path;
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
      // Redireciona diretamente para o painel do produtor
      window.location.href = "/ui/producer.html";
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
    // Redireciona diretamente para o painel do auditor
    window.location.href = "/ui/auditor.html";
  }

  async function registerProducerFlow() {
    const nameEl = document.getElementById("regName");
    const passEl = document.getElementById("regPass");

    const name = (nameEl ? nameEl.value : "").trim();
    const password = passEl ? passEl.value : "";

    if (!name || !password) {
      setOut("Preencha login e senha do produtor.");
      return;
    }

    setOut("Criando produtor...");

    await api("/producers/register", {
      method: "POST",
      json: { name, password },
    });

    setOut("Produtor criado. Fazendo login...");

    const data = await api("/auditors/login", {
      method: "POST",
      json: { nfc_uid: "__none__", password: "invalid" },
    });
    void data; // nunca deve chegar aqui; login inválido apenas para manter tipagem
  }

  function wireIndex() {
    const btn = document.getElementById("btnLogin");
    if (btn) {
      btn.addEventListener("click", () => {
        loginFlow().catch((e) => setOut(String(e.message || e)));
      });
    }
  }

  // Expose helpers to other pages
  window.UI = {
    api,
    getSession,
    setSession,
    clearSession,
    decodeJwtPayload,
    setOut,
  };

  window.UI_INIT = wireIndex;
})();

