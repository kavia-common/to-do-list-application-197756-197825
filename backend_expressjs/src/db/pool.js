'use strict';

const mysql = require('mysql2/promise');

/**
 * Builds a MySQL connection pool.
 *
 * Env vars supported:
 * - DB_HOST (default: localhost)
 * - DB_PORT (default: 5000)  // aligns with db_connection.txt port
 * - DB_USER (default: appuser)
 * - DB_PASSWORD (default: dbuser123)
 * - DB_NAME (default: myapp)
 *
 * Note: defaults are provided for local/dev. In production, set env vars explicitly.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5000),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'dbuser123',
  database: process.env.DB_NAME || 'myapp',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  timezone: 'Z'
});

module.exports = pool;
