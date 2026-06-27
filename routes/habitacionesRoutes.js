const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const { requerirLogin, soloAdmin } = require('../middlewares/roles');

// Aplicar middleware de autenticación a todas las rutas
router.use(requerirLogin);

// Ruta base: /habitaciones
// Listar todos
router.get('/', habitacionController.listar);

// Crear nueva habitación
router.get('/nueva', habitacionController.mostrarFormularioNuevo);
router.post('/nueva', habitacionController.guardar);

// Editar habitación
router.get('/editar/:id', habitacionController.mostrarFormularioEditar);
router.post('/editar/:id', habitacionController.actualizar);

// Eliminar habitación
router.get('/eliminar/:id', soloAdmin, habitacionController.eliminar);

module.exports = router;