const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');
const { soloEnfermero } = require('../middlewares/roles');

// redirección raíz
router.get('/', (req, res) => {
  return res.redirect('/internaciones');
});

// listar evaluaciones por internación (todos pueden ver)
router.get('/internacion/:internacionId', enfermeriaController.listarPorInternacion);

// nueva evaluación (solo enfermería y admin)
router.get('/nueva/:internacionId', soloEnfermero, enfermeriaController.mostrarFormularioNuevo);
router.post('/nueva', soloEnfermero, enfermeriaController.guardar);

// editar evaluación (solo enfermería y admin)
router.get('/editar/:id', soloEnfermero, enfermeriaController.mostrarFormularioEditar);
router.post('/editar/:id', soloEnfermero, enfermeriaController.actualizar);

// eliminar DESHABILITADO (nadie elimina)
router.get('/eliminar/:id', (req, res) => {
  return res.redirect('/internaciones?error=Acción no permitida: la eliminación de evaluaciones de enfermería está deshabilitada');
});

module.exports = router;
