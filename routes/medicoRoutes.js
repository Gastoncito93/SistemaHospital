const express = require('express');
const router = express.Router();
const evaluacionMedicaController = require('../controllers/evaluacionMedicaController');

// LISTAR evaluaciones de una internación
router.get('/internacion/:internacionId', evaluacionMedicaController.listarPorInternacion);

// FORMULARIO nueva evaluación
router.get('/nueva/:internacionId', evaluacionMedicaController.mostrarFormularioNuevo);

// GUARDAR nueva evaluación (sin parámetros en la URL)
router.post('/nueva', evaluacionMedicaController.guardar);

// FORMULARIO editar evaluación
router.get('/editar/:id', evaluacionMedicaController.mostrarFormularioEditar);

// GUARDAR edición
router.post('/editar/:id', evaluacionMedicaController.actualizar);

// ELIMINAR evaluación
router.get('/eliminar/:id', evaluacionMedicaController.eliminar);

module.exports = router;
