// config/db.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Obtienes un objeto idéntico, pero con métodos promise: .query() y .execute()
const db = connection.promise();

module.exports = db;
