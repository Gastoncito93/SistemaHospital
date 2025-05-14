const getConnection = require('../config/db');
const { actualizar } = require('./internacionModel');

const Habitacion = {
  async obtenerTodas() {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM habitaciones');
    return rows;
  },

  async obtenerDisponibles() {
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM habitaciones WHERE estado = 'libre'");
    return rows;
  },

  async obtenerPorId(id) {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT * FROM habitaciones WHERE id = '?'
    `, [id]);
    return rows[0];
  },

  async insertar(habitacion) {
    const db = await getConnection();
    const { numero, ala, tipo, estado } = habitacion;
    await db.query(
      'INSERT INTO habitaciones (numero, ala, tipo, estado) VALUES (?, ?, ?, ?)',
      [numero, ala, tipo, estado]
    );
  },

  async actualizarEstado(id, nuevoEstado) {
    const db = await getConnection();
    await db.query(
      'UPDATE habitaciones SET estado = ? WHERE id = ?',
      [nuevoEstado, id]
    );
  },

  async eliminar(id) {
    const db = await getConnection();
    await db.query('DELETE FROM habitaciones WHERE id = ?', [id]);
  },

};

module.exports = Habitacion;
