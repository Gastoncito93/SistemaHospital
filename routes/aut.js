// routes/aut.js
const express = require('express');
const router  = express.Router();
const aut     = require('../controllers/autController');

// Formularios
router.get('/registro', aut.getRegister);
router.get('/login',    aut.getLogin);

// Procesos
router.post('/registro', aut.postRegister);
router.post('/login',    aut.postLogin);

// Logout
router.get('/logout',    aut.logout);

module.exports = router;
