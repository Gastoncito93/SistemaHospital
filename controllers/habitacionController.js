const Habitacion = require('../models/habitacionModel');
const Estado = require('../models/estadoModel'); // Asegurate de tener este archivo
const Ala = require('../models/alaModel');
const Tipo = require('../models/tipoModel');


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

  mostrarFormularioNuevo: async (req, res) => {
        try {
            const alas = await Ala.obtenerTodos();
            const tipos = await Tipo.obtenerTodos();
            const estados = await Estado.obtenerTodos();

            res.render('habitaciones/nueva', {
            habitacion: {},
            alas,
            tipos,
            estados
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el formulario de nueva habitación');
        }
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

  // Mostrar formulario para editar estado
  mostrarFormularioEditar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const habitacion = await Habitacion.obtenerPorId(id);

      if (!habitacion) {
        return res.status(404).send('Habitación no encontrada');
      }

      const estados = await Estado.obtenerTodos(); // ⚠️ Nuevo: trae los estados
      res.render('habitaciones/editar', { habitacion, estados }); // ⚠️ Pasamos ambos
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la habitación');
    }
  },

  // Guardar cambios de edición (solo estado)
  actualizar: async (req, res) => {
    try {
      const id = req.params.id;
      const nuevoEstadoId = req.body.estado_id;
      await Habitacion.actualizarEstado(id, nuevoEstadoId);
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
