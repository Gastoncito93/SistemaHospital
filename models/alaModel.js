const db = require('../config/db'); // conexión promise()

const Ala = {
  async obtenerTodos() {
    const [rows] = await db.query('SELECT * FROM alas');
    return rows;
  }
};

module.exports = Ala;
