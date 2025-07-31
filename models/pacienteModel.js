const db = require('../config/db');

const Paciente = {
  obtenerTodos: async () => {
    // Ejecuta la query y devuelve sólo las filas
    const [rows] = await db.query('SELECT * FROM pacientes');
    return rows;
  },

    async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Paciente no encontrado');
        }
        return rows[0];
    },

    async buscarPorDNI(dni) {
        const [rows] = await db.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
        return rows[0]; // retorna el paciente si existe, undefined/null si no
    },

    async obtenerNoInternados() {
        const db = await getConnection();
        const [rows] = await db.query(`
            SELECT p.* FROM pacientes p
            WHERE NOT EXISTS (
                SELECT 1 FROM internaciones i
                WHERE i.paciente_id = p.id
            )
        `);
        return rows;
    },

    insertar: async (datos) => {
    const { nombre, apellido, dni, sexo } = datos;
    const [result] = await db.query(
      'INSERT INTO pacientes (nombre, apellido, dni, sexo) VALUES (?, ?, ?, ?)',
      [nombre, apellido, dni, sexo]
    );
    return result.insertId;
    },

    async actualizar(id, paciente) {
        const { nombre, apellido, dni, sexo } = paciente;
        await db.query(
            'UPDATE pacientes SET nombre = ?, apellido = ?, dni = ?, sexo = ? WHERE id = ?',
            [nombre, apellido, dni, sexo, id]
        );
    },

    eliminar: async (id) => {
    const [result] = await db.query(
      'DELETE FROM pacientes WHERE id = ?',
      [id]
    );
    // Opcional: puedes devolver cuántas filas se eliminaron
    return result.affectedRows;
  }
};

module.exports = Paciente;
