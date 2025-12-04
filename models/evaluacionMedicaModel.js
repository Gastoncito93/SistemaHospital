const db = require('../config/db');

const EvaluacionMedica = {

  // ⭐ Todas las evaluaciones de una internación
  async obtenerPorInternacion(internacionId) {
    const [rows] = await db.query(
      `SELECT *
       FROM evaluaciones_medicas
       WHERE internacion_id = ?
       ORDER BY fecha_hora DESC`,
      [internacionId]
    );
    return rows;
  },

  // ⭐ Obtener una evaluación (para edición)
  async obtenerPorId(id) {
  const [rows] = await db.query(
    `SELECT em.*, 
            p.nombre AS paciente_nombre,
            p.apellido AS paciente_apellido,
            h.numero AS habitacion_numero,
            a.nombre AS ala,
            t.nombre AS tipo
     FROM evaluaciones_medicas em
     JOIN internaciones i ON em.internacion_id = i.id
     JOIN pacientes p ON i.paciente_id = p.id
     JOIN habitaciones h ON i.habitacion_id = h.id
     JOIN alas a ON h.ala_id = a.id
     JOIN tipos t ON h.tipo_id = t.id
     WHERE em.id = ?`,
    [id]
  );
  return rows[0];
},

  // ⭐ Crear evaluación médica
  // ⭐ Crear evaluación médica
async insertar(datos) {
  const {
    internacion_id,
    fecha_hora,
    diagnostico,
    evolucion,
    tratamiento,
    medicacion,
    estudios_solicitados,
    notas
  } = datos;

  await db.query(
    `INSERT INTO evaluaciones_medicas
      (internacion_id, fecha_hora, diagnostico, evolucion, tratamiento, medicacion, estudios_solicitados, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      internacion_id,
      fecha_hora,
      diagnostico,
      evolucion,
      tratamiento,
      medicacion,
      estudios_solicitados || null,
      notas || null
    ]
  );
},


  // ⭐ Actualizar evaluación médica
  async actualizar(id, datos) {
  const {
    fecha_hora,
    diagnostico,
    evolucion,
    tratamiento,
    medicacion,
    estudios_solicitados,
    notas
  } = datos;

  await db.query(
    `UPDATE evaluaciones_medicas
     SET fecha_hora = ?, 
         diagnostico = ?, 
         evolucion = ?, 
         tratamiento = ?, 
         medicacion = ?, 
         estudios_solicitados = ?, 
         notas = ?
     WHERE id = ?`,
    [
      fecha_hora,
      diagnostico,
      evolucion,
      tratamiento,
      medicacion,
      estudios_solicitados,
      notas,
      id
    ]
  );
},

  // ⭐ Eliminar evaluación médica
  async eliminar(id) {
    await db.query(
      `DELETE FROM evaluaciones_medicas WHERE id = ?`,
      [id]
    );
  }
};

module.exports = EvaluacionMedica;
