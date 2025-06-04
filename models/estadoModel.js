const getConnection = require('../config/db');

const Estado = {
  async obtenerTodos() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM estados');
    return rows;
  },

  async obtenerPorNombre(nombre) {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM estados WHERE nombre = ?', [nombre]);
    return rows[0];
  }
};

module.exports = Estado;
