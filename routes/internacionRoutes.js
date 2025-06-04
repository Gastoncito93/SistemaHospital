const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController');

// Listar todas las internaciones
router.get('/', internacionController.listar);

// Mostrar formulario de nueva internación
router.get('/nueva', internacionController.mostrarFormulario);

// Procesar registro de internación
router.post('/nueva', internacionController.registrar);

// Obtener habitaciones disponibles segun sexo del paciente
router.get('/habitaciones-disponibles/:pacienteId', internacionController.obtenerHabitacionesDisponibles);

// Mostrar formulario de edición
//Actualizar internacion
router.get('/editar/:id', internacionController.mostrarFormularioEditar);
router.post('/editar/:id', internacionController.actualizar);

// Eliminar paciente
router.get('/eliminar/:id', internacionController.eliminar);


module.exports = router;
