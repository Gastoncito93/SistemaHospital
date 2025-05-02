const getConnection = require('../config/db');

const Internacion = {
  async obtenerTodas() {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT i.*, 
             p.nombre AS paciente_nombre, 
             p.apellido AS paciente_apellido,
             h.numero AS habitacion_numero, 
             h.ala, h.tipo
      FROM internaciones i
      JOIN pacientes p ON i.paciente_id = p.id
      JOIN habitaciones h ON i.habitacion_id = h.id
    `);
    return rows;
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
      SELECT h.*
      FROM habitaciones h
      WHERE h.estado = 'libre'

      UNION

      SELECT h.*
      FROM habitaciones h
      WHERE h.tipo = 'doble'
        AND h.estado = 'ocupada'
        AND NOT EXISTS (
          SELECT 1 FROM internaciones i
          JOIN pacientes p ON i.paciente_id = p.id
          WHERE i.habitacion_id = h.id AND p.sexo != ?
        )
    `, [sexo]);
    return rows;
  }
};

module.exports = Internacion;
