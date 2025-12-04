// models/usuarioModel.js
const db = require('../config/db');

const Usuario = {
  create: async ({ nombre, apellido, dni, email, pass, rol }) => {
  const [result] = await db.execute(
    `INSERT INTO usuario (nombre, apellido, dni, email, pass, rol)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, dni, email, pass, rol]
  );
  return result.insertId;
},

  findByEmail: async (email) => {
    const [rows] = await db.execute(
      `SELECT * FROM usuario WHERE email = ?`,
      [email]
    );
    return rows[0];
  },

  findByCredentials: async (email, pass) => {
    const [rows] = await db.execute(
      `SELECT * FROM usuario WHERE email = ? AND pass = ?`,
      [email, pass]
    );
    return rows[0];
  }
};

module.exports = Usuario;
