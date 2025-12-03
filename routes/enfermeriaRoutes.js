const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

// 👇 ESTA ES LA RUTA QUE ROMPE AHORA MISMO
// router.get('/', enfermeriaController.listarTodo);

// ✅ En vez de eso, redirigimos a /internaciones (como hablamos)
router.get('/', (req, res) => {
  return res.redirect('/internaciones');
});

// 📌 Lista todas las evaluaciones de una internación
router.get('/internacion/:internacionId', enfermeriaController.listarPorInternacion);

// 📌 Mostrar formulario NUEVA evaluación
router.get('/nueva/:internacionId', enfermeriaController.mostrarFormularioNuevo);

// 📌 Guardar nueva evaluación
router.post('/nueva', enfermeriaController.guardar);

// 📌 Mostrar formulario EDITAR evaluación
router.get('/editar/:id', enfermeriaController.mostrarFormularioEditar);

// 📌 Actualizar evaluación
router.post('/editar/:id', enfermeriaController.actualizar);

// 📌 Eliminar evaluación
router.get('/eliminar/:id', enfermeriaController.eliminar);

module.exports = router;
