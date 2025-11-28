const Internacion = require('../models/internacionModel');
const Paciente = require('../models/pacienteModel');
const Habitacion = require('../models/habitacionModel');
const Estado = require('../models/estadoModel');

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
        const pacientes = await Paciente.obtenerNoInternados();         // trae solo pacientes sin internaciones        // trae todos los pacientes desde la base de datos
         const habitaciones = await Habitacion.obtenerDisponibles();
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
      let habitaciones = [];
      if (internacion) {
        habitaciones = await Internacion.obtenerHabitacionesDisponiblesPorSexo(internacion.paciente_sexo);
      }

      res.render('internaciones/editar', { internacion, habitaciones });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la internación para edición');
    }
  },

  // Obtener habitaciones disponibles filtradas por sexo del paciente
  obtenerHabitacionesDisponibles: async (req, res) => {
    try {
      const pacienteId = parseInt(req.params.pacienteId, 10);
      const paciente = await Paciente.obtenerPorId(pacienteId);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }
      const habitaciones = await Internacion.obtenerHabitacionesDisponiblesPorSexo(paciente.sexo);
      res.json(habitaciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener habitaciones' });
    }
  },

  registrar: async (req, res) => {
  try {

    // Extraemos los nuevos campos además de los existentes
    const {
      paciente_id,
      habitacion_id,
      fecha_ingreso,
      motivo,
      tipo_ingreso,
      origen_paciente,
      observaciones
    } = req.body;

    // Guardamos la internación con los nuevos datos
    await Internacion.insertar({
      paciente_id,
      habitacion_id,
      fecha_ingreso,
      motivo,
      tipo_ingreso,
      origen_paciente,
      observaciones
    });

    // Lógica de actualización del estado de la habitación (tu lógica existente)
    const habitacionId = parseInt(habitacion_id, 10);
    const habitacion = await Habitacion.obtenerPorId(habitacionId);
    const ocupacion = await Internacion.contarPorHabitacion(habitacionId);

    let nombreEstado;
    if (habitacion.tipo === 'individual') {
      nombreEstado = 'ocupada';
    } else {
      nombreEstado = ocupacion >= 2 ? 'ocupada' : 'semi ocupado';
    }

    const estado = await Estado.obtenerPorNombre(nombreEstado);
    if (estado) {
      await Habitacion.actualizarEstado(habitacionId, estado.id);
    }

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

      const {
        habitacion_id,
        fecha_ingreso,
        motivo,
        tipo_ingreso,
        origen_paciente,
        observaciones
      } = req.body;

      await Internacion.actualizar(id, {
        habitacion_id,
        fecha_ingreso,
        motivo,
        tipo_ingreso,
        origen_paciente,
        observaciones
      });

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
