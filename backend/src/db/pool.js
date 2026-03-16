const { Pool } = require('pg');
const path = require('path');

// Carrega sempre o .env da pasta do backend, independente de onde o node for iniciado
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Mantém o comportamento original: se DB_PASSWORD não estiver definido,
// não envia nenhuma senha para o Pool (em vez de forçar string vazia).
const hasPassword = Object.prototype.hasOwnProperty.call(process.env, 'DB_PASSWORD');
const dbPassword = hasPassword ? process.env.DB_PASSWORD : undefined;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: dbPassword,
});

module.exports = pool;
