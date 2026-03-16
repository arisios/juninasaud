const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Frontend roda em outra porta, mas consome o backend em http://localhost:3000
app.use(cors());

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Rota raiz: tela de login
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Frontend simples rodando em http://localhost:${PORT}`);
});

