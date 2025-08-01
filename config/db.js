// config/db.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Exporta la conexión en modo promise
module.exports = connection.promise();