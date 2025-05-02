const getConnection = require('../config/db.js');

const Paciente = {
    async obtenerTodos() {
        const db = await getConnection();
        const [rows] = await db.query('SELECT * FROM pacientes');
        return rows;
    },

    async obtenerPorId(id) {
        const db = await getConnection();
        const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Paciente no encontrado');
        }
        return rows[0];
    },

    async insertar(paciente) {
        const db = await getConnection();
        const { nombre, apellido, dni, sexo } = paciente;
        await db.query(
            'INSERT INTO pacientes (nombre, apellido, dni, sexo) VALUES (?, ?, ?, ?)',
            [nombre, apellido, dni, sexo]
        );
    },

    async actualizar(id, paciente) {
        const db = await getConnection();
        const { nombre, apellido, dni, sexo } = paciente;
        await db.query(
            'UPDATE pacientes SET nombre = ?, apellido = ?, dni = ?, sexo = ? WHERE id = ?',
            [nombre, apellido, dni, sexo, id]
        );
    },

    async eliminar(id) {
        const db = await getConnection();
        await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    }
};

module.exports = Paciente;
