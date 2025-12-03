const db = require('../config/db');

const Enfermeria = {

  async obtenerPorInternacion(internacionId) {
    const [rows] = await db.query(
      'SELECT * FROM evaluaciones_enfermeria WHERE internacion_id = ? ORDER BY fecha_hora DESC',
      [internacionId]
    );
    return rows;
  },

  async obtenerPorId(id) {
  const [rows] = await db.query(`
    SELECT e.*, 
           p.nombre AS paciente_nombre,
           p.apellido AS paciente_apellido,
           h.numero AS habitacion_numero,
           a.nombre AS ala,
           t.nombre AS tipo
    FROM evaluaciones_enfermeria e
    JOIN internaciones i ON e.internacion_id = i.id
    JOIN pacientes p ON i.paciente_id = p.id
    JOIN habitaciones h ON i.habitacion_id = h.id
    JOIN alas a ON h.ala_id = a.id
    JOIN tipos t ON h.tipo_id = t.id
    WHERE e.id = ?
  `, [id]);

  return rows[0];
},


  async insertar(datos) {
    const {
      internacion_id,
      fecha_hora,
      presion_arterial,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      saturacion_oxigeno,
      dolor,
      motivo,
      sintomas,
      alergias,
      medicacion_actual,
      notas
    } = datos;

    await db.query(
      `INSERT INTO evaluaciones_enfermeria
      (internacion_id, fecha_hora, presion_arterial, frecuencia_cardiaca,
       frecuencia_respiratoria, temperatura, saturacion_oxigeno, dolor,
       motivo, sintomas, alergias, medicacion_actual, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        internacion_id,
        fecha_hora,
        presion_arterial,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        temperatura,
        saturacion_oxigeno,
        dolor,
        motivo,
        sintomas,
        alergias,
        medicacion_actual,
        notas
      ]
    );
  },

  async actualizar(id, datos) {
    const {
      fecha_hora,
      presion_arterial,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      saturacion_oxigeno,
      dolor,
      motivo,
      sintomas,
      alergias,
      medicacion_actual,
      notas
    } = datos;

    await db.query(
      `UPDATE evaluaciones_enfermeria
       SET fecha_hora = ?, presion_arterial = ?, frecuencia_cardiaca = ?,
           frecuencia_respiratoria = ?, temperatura = ?, saturacion_oxigeno = ?,
           dolor = ?, motivo = ?, sintomas = ?, alergias = ?, medicacion_actual = ?, notas = ?
       WHERE id = ?`,
      [
        fecha_hora,
        presion_arterial,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        temperatura,
        saturacion_oxigeno,
        dolor,
        motivo,
        sintomas,
        alergias,
        medicacion_actual,
        notas,
        id
      ]
    );
  },

  async eliminar(id) {
    await db.query('DELETE FROM evaluaciones_enfermeria WHERE id = ?', [id]);
  }
};

module.exports = Enfermeria;
