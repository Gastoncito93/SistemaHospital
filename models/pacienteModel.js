const db = require('../config/db.js');

const Paciente = {
    async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM pacientes');
        return rows;
    },

    async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Paciente no encontrado');
        }
        return rows[0]; // devolvés un único paciente, no un array
    },

    async insertar(paciente) {
        const { nombre, apellido, dni }= paciente;
        await db.query(
            'INSERT INTO pacientes (nombre, apellido, dni) VALUES (?, ?, ?)',
            [nombre, apellido, dni]
        )
    },

    async actualizar(id, paciente) {
        const { nombre, apellido, dni } = paciente;
        await db.query('UPDATE pacientes SET nombre = ?, apellido = ?, dni = ? WHERE id = ?',
            [nombre, apellido, dni, id]);
    },

    
    async eliminar(id) {
        await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    }
    
};

module.exports = Paciente;