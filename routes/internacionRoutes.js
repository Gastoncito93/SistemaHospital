const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController');

// Listar todas las internaciones
router.get('/', internacionController.listar);

// Mostrar formulario de nueva internación
router.get('/nueva', internacionController.mostrarFormulario);

// Procesar registro de internación
router.post('/nueva', internacionController.registrar);

module.exports = router;
