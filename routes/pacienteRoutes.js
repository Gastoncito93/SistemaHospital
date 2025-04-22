const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

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
router.get('/eliminar/:id', pacienteController.eliminar);

module.exports = router;