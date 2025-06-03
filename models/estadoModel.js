const getConnection = require('../config/db');

const Estado = {
  async obtenerTodos() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM estados');
    return rows;
  }
};

module.exports = Estado;
