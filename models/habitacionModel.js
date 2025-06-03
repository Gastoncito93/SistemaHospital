const getConnection = require('../config/db');

const Habitacion = {
  async obtenerTodas() {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
    `);
    return rows;
  },

  async obtenerDisponibles() {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      WHERE h.estado_id = 1 -- ID correspondiente a 'libre'
    `);
    return rows;
  },

  async obtenerPorId(id) {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      WHERE h.id = ?
    `, [id]);
    return rows[0];
  },

  async insertar(habitacion) {
    const db = await getConnection();
    const { numero, ala_id, tipo_id, estado_id } = habitacion;
    await db.query(
      'INSERT INTO habitaciones (numero, ala_id, tipo_id, estado_id) VALUES (?, ?, ?, ?)',
      [numero, ala_id, tipo_id, estado_id]
    );
  },

  async actualizarEstado(id, nuevoEstadoId) {
    const db = await getConnection();
    await db.query(
      'UPDATE habitaciones SET estado_id = ? WHERE id = ?',
      [nuevoEstadoId, id]
    );
  },

  async eliminar(id) {
    const db = await getConnection();
    await db.query('DELETE FROM habitaciones WHERE id = ?', [id]);
  }
};

module.exports = Habitacion;
