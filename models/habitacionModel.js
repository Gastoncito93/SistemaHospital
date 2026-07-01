const db = require('../config/db'); // conexión promise()

const Habitacion = {

  async obtenerTodas() {
    const [rows] = await db.query(`
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado,
             GROUP_CONCAT(CONCAT(p.nombre, ' ', p.apellido, ' (', p.sexo, ')') SEPARATOR ', ') AS pacientes
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      LEFT JOIN internaciones i ON h.id = i.habitacion_id AND i.estado_internacion = 'activa'
      LEFT JOIN pacientes p ON i.paciente_id = p.id
      GROUP BY h.id, h.numero, a.nombre, t.nombre, e.nombre
    `);
    return rows;
  },

  async obtenerDisponibles() {
    const [rows] = await db.query(`
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      WHERE h.estado_id = 1  -- libre
    `);
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await db.query(`
      SELECT h.id, h.numero, h.ala_id, h.tipo_id, h.estado_id,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado,
             GROUP_CONCAT(CONCAT(p.nombre, ' ', p.apellido, ' (', p.sexo, ')') SEPARATOR ', ') AS pacientes
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      LEFT JOIN internaciones i ON h.id = i.habitacion_id AND i.estado_internacion = 'activa'
      LEFT JOIN pacientes p ON i.paciente_id = p.id
      WHERE h.id = ?
      GROUP BY h.id, h.numero, a.nombre, t.nombre, e.nombre, h.ala_id, h.tipo_id, h.estado_id
    `, [id]);
    return rows[0];
  },

  async obtenerNumeros() {
  const [rows] = await db.query('SELECT numero FROM habitaciones ORDER BY numero ASC');
  return rows.map(r => Number(r.numero));
  },


  async insertar({ numero, ala_id, tipo_id, estado_id }) {
    await db.query(
      'INSERT INTO habitaciones (numero, ala_id, tipo_id, estado_id) VALUES (?, ?, ?, ?)',
      [numero, ala_id, tipo_id, estado_id]
    );
  },

  async actualizarEstado(id, nuevoEstadoId) {
    await db.query(
      'UPDATE habitaciones SET estado_id = ? WHERE id = ?',
      [nuevoEstadoId, id]
    );
  },

  async eliminar(id) {
    await db.query('DELETE FROM habitaciones WHERE id = ?', [id]);
  }
};

module.exports = Habitacion;
