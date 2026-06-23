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
      `SELECT id, nombre, rol
      FROM usuario
      WHERE email = ? AND pass = ?`,
      [email, pass]
    );
    return rows[0];
  }

  
};

Usuario.obtenerTodos = async () => {
  const [rows] = await db.execute(
    `SELECT id, nombre, apellido, email, rol
     FROM usuario
     ORDER BY apellido, nombre`
  );
  return rows;
};

// 🔹 Actualizar rol de un usuario
Usuario.actualizarRol = async (id, rol) => {
  await db.execute(
    `UPDATE usuario SET rol = ? WHERE id = ?`,
    [rol, id]
  );
};

module.exports = Usuario;
