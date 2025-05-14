const Internacion = require('../models/internacionModel');
const getConnection = require('../config/db');
const Paciente = require('../models/pacienteModel');
const Habitacion = require('../models/habitacionModel');

module.exports = {
  // Mostrar todas las internaciones
  listar: async (req, res) => {
    try {
      const internaciones = await Internacion.obtenerTodas();
      res.render('internaciones/lista', { internaciones });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener internaciones');
    }
  },

  // Mostrar formulario para nueva internación
    mostrarFormulario: async (req, res) => {
      try {
        const pacientes = await Paciente.obtenerTodos();         // trae todos los pacientes desde la base de datos
        const habitaciones = await Habitacion.obtenerTodas();    // trae todas las habitaciones
        res.render('internaciones/nueva', { pacientes, habitaciones }); // renderiza la vista PUG y le pasa los datos
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar formulario de internación');
      }
    },

  // Mostrar formulario de edición
  mostrarFormularioEditar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const internacion = await Internacion.obtenerPorId(id);
      const habitaciones = await Habitacion.obtenerDisponibles();

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      res.render('internaciones/editar', { internacion, habitaciones });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la internación para edición');
    }
  },

  // Registrar nueva internación
  registrar: async (req, res) => {
    try {
      await Internacion.insertar(req.body);
      res.redirect('/internaciones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al registrar internación');
    }
  },

  // Actualizar internacion
  actualizar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await Internacion.actualizar(id, req.body);
      res.redirect('/internaciones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la internación');
    }
  },

  // Eliminar internacion
  eliminar: async (req, res) => {
    try {
      await Internacion.eliminar(req.params.id);
      res.redirect('/internaciones/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la internación');
    }
  }
};
