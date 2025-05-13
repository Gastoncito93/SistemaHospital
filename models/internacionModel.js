const getConnection = require('../config/db');

const Internacion = {
  async obtenerTodas() {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT i.*, 
             p.nombre AS paciente_nombre, 
             p.apellido AS paciente_apellido,
             h.numero AS habitacion_numero, 
             h.ala, 
             h.tipo
      FROM internaciones i
      JOIN pacientes p ON i.paciente_id = p.id
      JOIN habitaciones h ON i.habitacion_id = h.id
    `);
    return rows;
  },

  async obtenerPorId(id) {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT i.*, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
      FROM internaciones i
      JOIN pacientes p ON i.paciente_id = p.id
      WHERE i.id = ?
    `, [id]);
    return rows[0];
  },

  async insertar(data) {
    const db = await getConnection();
    const { paciente_id, habitacion_id, fecha_ingreso, motivo } = data;

    await db.query(
      'INSERT INTO internaciones (paciente_id, habitacion_id, fecha_ingreso, motivo) VALUES (?, ?, ?, ?)',
      [paciente_id, habitacion_id, fecha_ingreso, motivo]
    );
  },

  async obtenerHabitacionesDisponiblesPorSexo(sexo) {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT * FROM habitaciones
      WHERE estado = 'libre'
         OR (
           tipo = 'doble' AND estado = 'ocupada' AND NOT EXISTS (
             SELECT 1 FROM internaciones i
             JOIN pacientes p ON i.paciente_id = p.id
             WHERE i.habitacion_id = habitaciones.id AND p.sexo != ?
           )
         )
    `, [sexo]);
    return rows;
  },

  async actualizar(id, data) {
    const db = await getConnection();
    const { habitacion_id, fecha_ingreso, motivo } = data;
    await db.query(
      'UPDATE internaciones SET habitacion_id = ?, fecha_ingreso = ?, motivo = ? WHERE id = ?',
      [habitacion_id, fecha_ingreso, motivo, id]
    );
  },

  async eliminar(id) {
    const db = await getConnection();
    await db.query('DELETE FROM internaciones WHERE id = ?', [id]);
  }

};

module.exports = Internacion;
