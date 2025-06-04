const getConnection = require('../config/db');

const Internacion = {
 async obtenerTodas() {
  const db = await getConnection();
  const [rows] = await db.query(`
    SELECT i.*, 
           p.nombre AS paciente_nombre, 
           p.apellido AS paciente_apellido,
           h.numero AS habitacion_numero, 
           a.nombre AS ala,
           t.nombre AS tipo
    FROM internaciones i
    JOIN pacientes p ON i.paciente_id = p.id
    JOIN habitaciones h ON i.habitacion_id = h.id
    JOIN alas a ON h.ala_id = a.id
    JOIN tipos t ON h.tipo_id = t.id
  `);
  return rows;
},


  async obtenerPorId(id) {
    const db = await getConnection();
    const [rows] = await db.query(`
      SELECT i.*,
             p.nombre AS paciente_nombre,
             p.apellido AS paciente_apellido,
             p.sexo AS paciente_sexo
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
      SELECT h.id, h.numero,
             a.nombre AS ala,
             t.nombre AS tipo,
             e.nombre AS estado
      FROM habitaciones h
      JOIN alas a ON h.ala_id = a.id
      JOIN tipos t ON h.tipo_id = t.id
      JOIN estados e ON h.estado_id = e.id
      LEFT JOIN internaciones i ON i.habitacion_id = h.id
      LEFT JOIN pacientes p ON p.id = i.paciente_id
      GROUP BY h.id
      HAVING (
        e.nombre = 'libre' AND COUNT(i.id) = 0
      ) OR (
        t.nombre = 'doble'
        AND e.nombre <> 'limpieza'
        AND COUNT(i.id) = 1
        AND SUM(CASE WHEN p.sexo != ? THEN 1 ELSE 0 END) = 0
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
  },

  async contarPorHabitacion(habitacionId) {
    const db = await getConnection();
    const [rows] = await db.query(
      'SELECT COUNT(*) AS cantidad FROM internaciones WHERE habitacion_id = ?',
      [habitacionId]
    );
    return rows[0].cantidad;
  }

};

module.exports = Internacion;
