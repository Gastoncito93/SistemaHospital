// routes/pacienteRoutes.js
const express = require('express');
const router  = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { requerirLogin, requireRol, soloAdmin } = require('../middlewares/roles');

// Aplicar middleware de autenticación y rol a todas las rutas
router.use(requerirLogin);
router.use(requireRol(['admin', 'medico', 'enfermero']));

// Ruta base: /pacientes

// Listar todos
router.get('/', pacienteController.listar);


// Crear nuevo paciente
router.get('/nuevo', pacienteController.mostrarFormularioNuevo);
router.post('/nuevo', pacienteController.guardar);

// Editar paciente
router.get('/editar/:id', pacienteController.mostrarFormularioEditar);
router.post('/editar/:id', pacienteController.actualizar);

// Eliminar paciente
router.get('/eliminar/:id', soloAdmin, pacienteController.eliminar);

// Ver Historial / Historia Clínica Única
router.get('/historial/:id', pacienteController.verHistorial);

module.exports = router;

