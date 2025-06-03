const getConnection = require('../config/db');

const Tipo = {
  async obtenerTodos() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM tipos');
    return rows;
  }
};

module.exports = Tipo;
