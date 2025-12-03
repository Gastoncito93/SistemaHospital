require('dotenv').config();
const express = require('express');
const path    = require('path');
const session = require('express-session');
require('./models/sync');

const pacienteRoutes = require('./routes/pacienteRoutes');
const internacionRoutes = require('./routes/internacionRoutes');
const habitacionesRoutes = require('./routes/habitacionesRoutes');
const enfermeriaRoutes = require('./routes/enfermeriaRoutes');
const autRoutes = require('./routes/aut');

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'unSecreto',
  resave: false,
  saveUninitialized: false
}));

// Vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Variable local para plantillas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rutas
app.use('/', autRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/internaciones', internacionRoutes);
app.use('/habitaciones', habitacionesRoutes);
app.use('/enfermeria', enfermeriaRoutes);

// Redirigir raíz a /login
app.get('/', (req, res) => res.redirect('/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
