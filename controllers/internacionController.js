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
      nombreEstado = 'Ocupada';
    } else {
      nombreEstado = ocupacion >= 2 ? 'Ocupada' : 'Semi-Ocupada';
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
        observaciones,
        identificar_nombre,
        identificar_apellido,
        identificar_dni,
        identificar_sexo
      } = req.body;

      // 1. Obtener la internación actual para saber el paciente actual
      const internacionActual = await Internacion.obtenerPorId(id);
      let nuevoPacienteId = internacionActual.paciente_id;

      // 2. Si se ingresaron datos de identificación del paciente NN
      if (identificar_nombre || identificar_apellido || identificar_dni || identificar_sexo) {
        if (!identificar_nombre || !identificar_apellido || !identificar_dni || !identificar_sexo) {
          return res.status(400).send('Para identificar al paciente debe completar todos los campos (Nombre, Apellido, DNI y Sexo)');
        }

        const dni = identificar_dni.trim();
        if (!/^\d+$/.test(dni)) {
          return res.status(400).send('El DNI debe ser un número entero');
        }

        const pacienteIdTemp = internacionActual.paciente_id;
        const pacienteExistente = await Paciente.buscarPorDNI(dni);

        if (pacienteExistente && pacienteExistente.id !== pacienteIdTemp) {
          // --- ESCENARIO DE FUSIÓN (MERGE) ---
          const db = require('../config/db');

          // Validar si el paciente de destino ya tiene una internación activa
          const [yaInternado] = await db.query(
            "SELECT 1 FROM internaciones WHERE paciente_id = ? AND estado_internacion = 'activa'",
            [pacienteExistente.id]
          );
          if (yaInternado.length > 0) {
            return res.redirect(`/internaciones?error=El paciente con el DNI ingresado ya se encuentra internado. No es posible realizar la fusión.`);
          }

          // Obtener los datos del paciente de emergencia actual (antes de borrarlo)
          const pacienteEmergencia = await Paciente.obtenerPorId(pacienteIdTemp);

          // Obtener todas las internaciones de este paciente de emergencia
          const [internacionesTemp] = await db.query(
            'SELECT * FROM internaciones WHERE paciente_id = ?',
            [pacienteIdTemp]
          );

          // Transferimos todas las internaciones al paciente existente
          for (const iTemp of internacionesTemp) {
            const notaEmergencia = `\n[Ingreso de emergencia original: Registrado como ${pacienteEmergencia.nombre} (${pacienteEmergencia.apellido})]`;
            const nuevasObs = (iTemp.observaciones || '') + notaEmergencia;
            const nuevoMot = iTemp.motivo.includes('Emergencia')
              ? iTemp.motivo
              : `Emergencia: ${iTemp.motivo}`;

            await db.query(
              `UPDATE internaciones 
               SET paciente_id = ?, observaciones = ?, motivo = ?
               WHERE id = ?`,
              [pacienteExistente.id, nuevasObs, nuevoMot, iTemp.id]
            );
          }

          // Eliminamos el paciente temporal
          await Paciente.eliminar(pacienteIdTemp);

          // La internación que estamos editando ahora pertenece al paciente existente
          nuevoPacienteId = pacienteExistente.id;
        } else {
          // --- ESCENARIO NORMAL ---
          // Si no existe conflicto de DNI, actualizamos los datos del paciente NN convirtiéndolo en uno real
          await Paciente.actualizar(pacienteIdTemp, {
            nombre: identificar_nombre,
            apellido: identificar_apellido,
            dni: dni,
            sexo: identificar_sexo
          });
        }
      }

      // 3. Actualizamos los datos de la internación
      await Internacion.actualizar(id, {
        habitacion_id,
        fecha_ingreso,
        motivo,
        tipo_ingreso,
        origen_paciente,
        observaciones
      });

      res.redirect('/internaciones?success=La internación ha sido actualizada y el paciente ha sido identificado/fusionado con éxito.');
    } catch (error) {
      console.error('Error al actualizar la internación:', error);
      res.status(500).send('Error al actualizar la internación');
    }
  },

  // Eliminar internacion
  eliminar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const internacion = await Internacion.obtenerPorId(id);
      if (!internacion) {
        return res.redirect('/internaciones?error=Internación no encontrada');
      }
      
      const habitacionId = internacion.habitacion_id;
      
      // Eliminar internación
      await Internacion.eliminar(id);
      
      // Recalcular y actualizar el estado de la habitación
      const db = require('../config/db');
      const [rows] = await db.query(
        "SELECT COUNT(*) AS activas FROM internaciones WHERE habitacion_id = ? AND estado_internacion = 'activa'",
        [habitacionId]
      );
      const activas = rows[0].activas;

      let nombreEstado = 'Libre';
      if (activas === 1) {
        nombreEstado = 'Semi-Ocupada';
      } else if (activas >= 2) {
        nombreEstado = 'Ocupada';
      }

      const estado = await Estado.obtenerPorNombre(nombreEstado);
      if (estado) {
        await Habitacion.actualizarEstado(habitacionId, estado.id);
      }
      
      res.redirect('/internaciones/?success=Internación eliminada y estado de habitación actualizado correctamente.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la internación');
    }
  },

  // Mostrar formulario de Alta Médica
  mostrarAltaForm: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const internacion = await Internacion.obtenerPorId(id);

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      res.render('internaciones/alta', { internacion });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario de alta');
    }
  },

  // Procesar el Alta Médica
  procesarAlta: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { fecha_alta, motivo_alta } = req.body;

      const internacion = await Internacion.obtenerPorId(id);
      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // 1. Dar el alta en la base de datos
      await Internacion.darAlta(id, { fecha_alta, motivo_alta });

      // 2. Actualizar el estado de la habitación
      const habitacionId = internacion.habitacion_id;
      const db = require('../config/db');
      
      // Contar cuántas internaciones activas quedan en esa habitación
      const [rows] = await db.query(
        "SELECT COUNT(*) AS activas FROM internaciones WHERE habitacion_id = ? AND estado_internacion = 'activa'",
        [habitacionId]
      );
      const activas = rows[0].activas;

      let nombreEstado = 'Libre';
      if (activas === 1) {
        nombreEstado = 'Semi-Ocupada';
      } else if (activas >= 2) {
        nombreEstado = 'Ocupada';
      }

      const estado = await Estado.obtenerPorNombre(nombreEstado);
      if (estado) {
        await Habitacion.actualizarEstado(habitacionId, estado.id);
      }

      res.redirect('/internaciones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar el alta médica');
    }
  },

  obtenerHabitacionesDisponiblesPorSexo: async (req, res) => {
    try {
      const { sexo } = req.params;
      const habitaciones = await Internacion.obtenerHabitacionesDisponiblesPorSexo(sexo);
      res.json(habitaciones);
    } catch (error) {
      console.error('Error al obtener habitaciones por sexo:', error);
      res.status(500).json({ error: 'Error al obtener habitaciones' });
    }
  },

  registrarEmergenciaRapida: async (req, res) => {
    try {
      const { sexo, descripcion, habitacion_id } = req.body;

      if (!sexo || !descripcion || !habitacion_id) {
        return res.redirect('/internaciones?error=Todos los campos son obligatorios para el ingreso de emergencia. Debe haber camas disponibles.');
      }

      // Validar si la habitación seleccionada realmente está libre y es compatible con el sexo
      const habitacionesDisponibles = await Internacion.obtenerHabitacionesDisponiblesPorSexo(sexo);
      const habitacionValida = habitacionesDisponibles.some(h => h.id === parseInt(habitacion_id, 10));

      if (!habitacionValida) {
        return res.redirect('/internaciones?error=La habitación seleccionada ya no está disponible o no hay camas libres para este sexo.');
      }

      // 1. Crear el paciente temporal
      // Usamos "Paciente NN" como nombre y la descripción como apellido
      const pacienteId = await Paciente.insertar({
        nombre: 'Paciente NN',
        apellido: descripcion,
        dni: null,
        sexo: sexo
      });

      // 2. Crear la internación activa
      const fecha_ingreso = new Date();
      await Internacion.insertar({
        paciente_id: pacienteId,
        habitacion_id,
        fecha_ingreso,
        motivo: 'Ingreso de Emergencia',
        tipo_ingreso: 'Guardia',
        origen_paciente: 'SAME / Ambulancia',
        observaciones: `Ingreso de emergencia original: Paciente NN - ${descripcion}`
      });

      // 3. Actualizar el estado de la habitación
      const habitacionId = parseInt(habitacion_id, 10);
      const habitacion = await Habitacion.obtenerPorId(habitacionId);
      const ocupacion = await Internacion.contarPorHabitacion(habitacionId);

      let nombreEstado;
      if (habitacion.tipo === 'individual') {
        nombreEstado = 'Ocupada';
      } else {
        nombreEstado = ocupacion >= 2 ? 'Ocupada' : 'Semi-Ocupada';
      }

      const estado = await Estado.obtenerPorNombre(nombreEstado);
      if (estado) {
        await Habitacion.actualizarEstado(habitacionId, estado.id);
      }

      // Redirigir a la lista de internaciones con mensaje de éxito
      res.redirect('/internaciones?success=Ingreso de emergencia rápido registrado con éxito.');

    } catch (error) {
      console.error('Error al registrar ingreso de emergencia rápido:', error);
      res.redirect('/internaciones?error=Error al registrar el ingreso de emergencia.');
    }
  }
};
