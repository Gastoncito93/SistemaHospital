const db = require('../config/db'); // conexión promise()

const Estado = {

  async obtenerTodos() {
    const [rows] = await db.query('SELECT * FROM estados');
    return rows;
  },

  async obtenerPorNombre(nombre) {
    const [rows] = await db.query(
      'SELECT * FROM estados WHERE nombre = ?',
      [nombre]
    );
    return rows[0];
  }

};

module.exports = Estado;
