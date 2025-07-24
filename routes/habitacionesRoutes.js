const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

// Ruta base: /habitaciones
// Listar todos
router.get('/', habitacionController.listar);

// Crear nuevo paciente
router.get('/nueva', habitacionController.mostrarFormularioNuevo);
router.post('/nueva', habitacionController.guardar);

// Editar paciente
router.get('/editar/:id', habitacionController.mostrarFormularioEditar);
router.post('/editar/:id', habitacionController.actualizar);

// Eliminar paciente
router.get('/eliminar/:id', habitacionController.eliminar);

module.exports = router;