// routes/usuarioRoutes.js
const express = require('express');
const router  = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requerirLogin, soloAdmin } = require('../middlewares/roles');

// Aplicar restricción de inicio de sesión y rol de administrador a todas las rutas
router.use(requerirLogin);
router.use(soloAdmin);

// Listar usuarios
router.get('/', usuarioController.listar);

// Actualizar rol de un usuario
router.post('/actualizar-rol/:id', usuarioController.actualizarRol);

module.exports = router;
