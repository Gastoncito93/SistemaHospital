const Habitacion = require('../models/habitacionModel');

module.exports = {
    // Mostrar todas las habitaciones
    listar: async (req, res) => {
        try {
            const habitaciones = await Habitacion.obtenerTodas();
            res.render('habitaciones/lista', { habitaciones });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener habitaciones');
        }
    },

    // Mostrar formulario para crear nueva habitación
    mostrarFormularioNuevo: (req, res) => {
        res.render('habitaciones/nueva', { habitacion: {} });
    },

    // Guardar nueva habitación
    guardar: async (req, res) => {
        try {
            await Habitacion.insertar(req.body);
            res.redirect('/habitaciones');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al guardar la habitación');
        }
    },

    // Mostrar formulario para editar habitación
    mostrarFormularioEditar: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const habitacion = await Habitacion.obtenerPorId(id);

            if (!habitacion) {
                return res.status(404).send('Habitación no encontrada');
            }

            res.render('habitaciones/editar', { habitacion });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar la habitación');
        }
    },

    // Guardar cambios de edición
    actualizar: async (req, res) => {
        try {
            await Habitacion.actualizarEstado(req.params.id, req.body.estado);
            res.redirect('/habitaciones');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar el estado de la habitación');
        }
      },

    // Eliminar habitación
    eliminar: async (req, res) => {
        try {
            await Habitacion.eliminar(req.params.id);
            res.redirect('/habitaciones');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar la habitación');
        }
    }
};
