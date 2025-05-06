const Internacion = require('../models/internacionModel');
const getConnection = require('../config/db');
const Paciente = require('../models/pacienteModel')
const Habitacion = require('../models//habitacionModel')

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

  // Registrar nueva internación
  registrar: async (req, res) => {
    try {
      await Internacion.insertar(req.body);
      res.redirect('/internaciones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al registrar internación');
    }
  }
};
