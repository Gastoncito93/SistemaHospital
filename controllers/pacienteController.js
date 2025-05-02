const Paciente = require('../models/pacienteModel');

module.exports = {
    // Mostrar todos los pacientes
    listar: async (req, res) => {
        try {
            const pacientes = await Paciente.obtenerTodos();
            res.render('pacientes/lista', { pacientes });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener pacientes');
        }
    },

    

    // Formulario para crear nuevo paciente
    mostrarFormularioNuevo: (req, res) => {
        res.render('pacientes/nuevo', { paciente: {} });
      },

    // Guardar nuevo paciente
    guardar: async (req, res) => {
        try {
          console.log('BODY:', req.body); // <-- Agregar esto
          await Paciente.insertar(req.body);
          res.redirect('/pacientes');
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al guardar el paciente');
        }
      },

    mostrarFormularioEditar: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            console.log('ID recibido:', req.params.id);

            if (isNaN(id)) {
                return res.status(400).send('ID inválido');
            }

            const paciente = await Paciente.obtenerPorId(id);
            console.log('Paciente encontrado:', paciente);

            if (!paciente) {
                return res.status(404).send('Paciente no encontrado');
            }

            res.render('pacientes/editar', { paciente });
        } catch (error) {
            console.error(error);
            console.error('ERROR DETECTADO:', error);
            res.status(500).send('Error al cargar el paciente');
        }
    },


    // Guardar cambios de edición
    actualizar: async (req, res) => {
        try {
          console.log('BODY:', req.body); // <-- Agregar esto
          await Paciente.actualizar(req.params.id, req.body);
          res.redirect('/pacientes');
        } catch (error) {
          console.error(error);
          res.status(500).send('Error al actualizar el paciente');
        }
      },

    // Eliminar paciente
    eliminar: async (req, res) => {
        try {
            await Paciente.eliminar(req.params.id);
            res.redirect('/pacientes');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar el paciente');
        }
    }
};