const db = require('../config/db'); // conexión promise()

const Tipo = {
  async obtenerTodos() {
    const [rows] = await db.query('SELECT * FROM tipos');
    return rows;
  }
};

module.exports = Tipo;
