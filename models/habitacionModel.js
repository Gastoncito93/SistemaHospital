const getConnection = require('../config/db');

const Habitacion = {
  async obtenerTodas() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM habitaciones');
    return rows;
  },

  async obtenerDisponibles() {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT * FROM habitaciones
      WHERE estado = 'libre'
    `);
    return rows;
  },

  async actualizarEstado(id, nuevoEstado) {
    const db = await getConnection();
    await db.query(
      'UPDATE habitaciones SET estado = ? WHERE id = ?',
      [nuevoEstado, id]
    );
  }
};

module.exports = Habitacion;
