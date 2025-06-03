const getConnection = require('../config/db');

const Ala = {
  async obtenerTodos() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM alas');
    return rows;
  }
};

module.exports = Ala;
