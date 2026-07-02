const Paciente = require('../models/pacienteModel');

module.exports = {
    // Mostrar todos los pacientes
    listar: async (req, res) => {
  try {
    const pacientes = await Paciente.obtenerTodos();
    return res.render('pacientes/lista', { pacientes });
  } catch (error) {
    console.error('Error en listar pacientes:', error);
    return res.render('pacientes/lista', { pacientes: [], error: error.message });
  }
},

    

    // Formulario para crear nuevo paciente
    mostrarFormularioNuevo: (req, res) => {
        res.render('pacientes/nuevo', { paciente: {} });
      },

    // Guardar nuevo paciente
   // controllers/pacienteController.js
guardar: async (req, res) => {
  console.log('📥 GUARDAR BODY:', req.body);
  try {
    const { nombre, apellido, dni, sexo } = req.body;

    // 1. Campos obligatorios
    if (!nombre?.trim() || !apellido?.trim() || !dni?.trim() || !sexo?.trim()) {
      return res.render('pacientes/nuevo', {
        paciente: req.body,
        error: 'Todos los campos (Nombre, Apellido, DNI, Sexo) son obligatorios.'
      });
    }

    // 2. DNI debe contener solo números
    if (!/^\d+$/.test(dni.trim())) {
      return res.render('pacientes/nuevo', {
        paciente: req.body,
        error: 'El DNI debe contener únicamente números.'
      });
    }

    // 3. Validar si ya existe otro paciente con el mismo DNI
    const pacienteExistente = await Paciente.buscarPorDNI(dni.trim());
    if (pacienteExistente) {
      return res.render('pacientes/nuevo', {
        paciente: req.body,
        error: `El paciente con el DNI ${dni.trim()} ya se encuentra registrado con el nombre de "${pacienteExistente.nombre} ${pacienteExistente.apellido}".`
      });
    }

    await Paciente.insertar(req.body);
    return res.redirect('/pacientes');
  } catch (error) {
    console.error('🚨 ERROR AL GUARDAR:', error);
    // renderiza la misma vista con el mensaje
    return res.render('pacientes/nuevo', { 
      paciente: req.body, 
      error: error.message 
    });
  }
},

    mostrarFormularioEditar: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const page = req.query.page || '';
            console.log('ID recibido:', req.params.id);

            if (isNaN(id)) {
                return res.status(400).send('ID inválido');
            }

            const paciente = await Paciente.obtenerPorId(id);
            console.log('Paciente encontrado:', paciente);

            if (!paciente) {
                return res.status(404).send('Paciente no encontrado');
            }

            res.render('pacientes/editar', { paciente, page });
        } catch (error) {
            console.error(error);
            console.error('ERROR DETECTADO:', error);
            res.status(500).send('Error al cargar el paciente');
        }
    },


    // Guardar cambios de edición
    actualizar: async (req, res) => {
    try {
      const { nombre, apellido, dni, sexo } = req.body;

      if (!nombre || !apellido || !dni || !sexo) {
        return res.status(400).send('Todos los campos son obligatorios');
      }

      if (!/^\d+$/.test(dni)) {
        return res.status(400).send('El DNI debe ser un número entero');
      }

      const pacienteId = parseInt(req.params.id, 10);

      // Verificamos si ya existe otro paciente con el DNI ingresado
      const pacienteExistente = await Paciente.buscarPorDNI(dni);

      if (pacienteExistente && pacienteExistente.id !== pacienteId) {
        // --- ESCENARIO DE FUSIÓN (MERGE) ---
        // Si ya existe un paciente con ese DNI, transferimos las internaciones
        // y eliminamos el paciente temporal.
        const db = require('../config/db');

        // Validar si el paciente de destino ya tiene una internación activa
        const [yaInternado] = await db.query(
          "SELECT 1 FROM internaciones WHERE paciente_id = ? AND estado_internacion = 'activa'",
          [pacienteExistente.id]
        );
        if (yaInternado.length > 0) {
          return res.redirect('/pacientes?error=El paciente con el DNI ingresado ya se encuentra internado. No es posible realizar la fusión.');
        }

        // 1. Obtener datos del paciente temporal actual (para guardar la descripción visual)
        const pacienteEmergencia = await Paciente.obtenerPorId(pacienteId);

        // 2. Obtener todas las internaciones del paciente de emergencia
        const [internaciones] = await db.query(
          'SELECT * FROM internaciones WHERE paciente_id = ?',
          [pacienteId]
        );

        // 3. Transferir las internaciones al paciente existente, agregando la nota de emergencia
        for (const internacion of internaciones) {
          const notaEmergencia = `\n[Ingreso de emergencia original: Registrado como ${pacienteEmergencia.nombre} (${pacienteEmergencia.apellido})]`;
          const nuevasObservaciones = (internacion.observaciones || '') + notaEmergencia;
          const nuevoMotivo = internacion.motivo.includes('Emergencia')
            ? internacion.motivo
            : `Emergencia: ${internacion.motivo}`;

          await db.query(
            `UPDATE internaciones 
             SET paciente_id = ?, observaciones = ?, motivo = ?
             WHERE id = ?`,
            [pacienteExistente.id, nuevasObservaciones, nuevoMotivo, internacion.id]
          );
        }

        // 4. Eliminar el paciente de emergencia temporal
        await Paciente.eliminar(pacienteId);

        const page = req.query.page || '';
        return res.redirect(`/pacientes?success=El paciente de emergencia ha sido identificado y fusionado con el paciente existente con éxito.${page ? '&page=' + page : ''}`);
      } else {
        // --- ESCENARIO NORMAL ---
        // Si no existe conflicto de DNI o es el mismo paciente, actualizamos normalmente
        await Paciente.actualizar(pacienteId, req.body);
        const page = req.query.page || '';
        return res.redirect(`/pacientes?success=Datos del paciente actualizados correctamente.${page ? '&page=' + page : ''}`);
      }
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      res.status(500).send('Error al actualizar el paciente');
    }
  },


    // Eliminar paciente
    eliminar: async (req, res) => {
        try {
            await Paciente.eliminar(req.params.id);
            if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
                return res.json({ success: true, message: 'Paciente eliminado correctamente' });
            }
            const page = req.query.page || '';
            res.redirect(`/pacientes?success=Paciente eliminado correctamente.${page ? '&page=' + page : ''}`);
        } catch (error) {
            console.error(error);
            if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
                return res.status(500).json({ success: false, message: 'Error al eliminar el paciente' });
            }
            res.status(500).send('Error al eliminar el paciente');
        }
    },

    // Ver Historia Clínica Única del Paciente
    verHistorial: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const db = require('../config/db');

            // 1. Obtener datos del paciente
            const [pacientes] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
            const paciente = pacientes[0];
            if (!paciente) {
                return res.status(404).send('Paciente no encontrado');
            }

            // 2. Obtener todas las internaciones del paciente
            const [internaciones] = await db.query(`
                SELECT i.*, h.numero AS habitacion_numero, a.nombre AS ala_nombre
                FROM internaciones i
                LEFT JOIN habitaciones h ON i.habitacion_id = h.id
                LEFT JOIN alas a ON h.ala_id = a.id
                WHERE i.paciente_id = ?
                ORDER BY i.id DESC
            `, [id]);

            // 3. Por cada internación, cargar sus evaluaciones médicas y de enfermería
            for (let i = 0; i < internaciones.length; i++) {
                const intId = internaciones[i].id;
                
                const [medicas] = await db.query(
                    'SELECT * FROM evaluaciones_medicas WHERE internacion_id = ? ORDER BY fecha_hora DESC',
                    [intId]
                );
                
                const [enfermeria] = await db.query(
                    'SELECT * FROM evaluaciones_enfermeria WHERE internacion_id = ? ORDER BY fecha_hora DESC',
                    [intId]
                );

                internaciones[i].evaluacionesMedicas = medicas;
                internaciones[i].evaluacionesEnfermeria = enfermeria;
            }

            // 4. Renderizar vista del historial
            res.render('pacientes/historial', {
                paciente,
                internaciones
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar la historia clínica');
        }
    }
};