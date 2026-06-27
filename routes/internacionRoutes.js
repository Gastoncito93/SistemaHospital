const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController');
const { requerirLogin, soloAdmin, soloMedico } = require('../middlewares/roles');

// Aplicar middleware de autenticación a todas las rutas
router.use(requerirLogin);

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

// Eliminar internación
router.get('/eliminar/:id', soloAdmin, internacionController.eliminar);

// Alta médica (solo médicos y admins)
router.get('/alta/:id', soloMedico, internacionController.mostrarAltaForm);
router.post('/alta/:id', soloMedico, internacionController.procesarAlta);


module.exports = router;
