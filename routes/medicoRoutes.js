const express = require('express');
const router = express.Router();
const evaluacionMedicaController = require('../controllers/evaluacionMedicaController');
const { soloMedico } = require('../middlewares/roles');

// redirección raíz
router.get('/', (req, res) => {
  return res.redirect('/internaciones');
});

// listar evaluaciones médicas por internación (todos pueden ver)
router.get('/internacion/:internacionId', evaluacionMedicaController.listarPorInternacion);

// nueva evaluación (solo médico y admin)
router.get('/nueva/:internacionId', soloMedico, evaluacionMedicaController.mostrarFormularioNuevo);
router.post('/nueva', soloMedico, evaluacionMedicaController.guardar);

// editar evaluación (solo médico y admin)
router.get('/editar/:id', soloMedico, evaluacionMedicaController.mostrarFormularioEditar);
router.post('/editar/:id', soloMedico, evaluacionMedicaController.actualizar);

// eliminar DESHABILITADO
router.get('/eliminar/:id', (req, res) => {
  return res.status(403).send('Acción no permitida');
});

module.exports = router;
