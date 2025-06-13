const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
require('dotenv').config();
require('./models/sync');

app.use(session({
  secret: 'secreto-super-seguro',
  resave: false,
  saveUninitialized: true
}));

// Rutas
const pacienteRoutes = require('./routes/pacienteRoutes');
const internacionRoutes = require('./routes/internacionRoutes');
const habitacionesRoutes = require('./routes/habitacionesRutes');



// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));


// Configurar motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Servir archivos estáticos (por si usás CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});


// Usar las rutas
app.use('/pacientes', pacienteRoutes);
app.use('/internaciones', internacionRoutes);
app.use('/habitaciones', habitacionesRoutes);

// Ruta raíz redirige a /pacientes
// Ruta raíz va al login
app.get('/', (req, res) => {
  res.render('login');
});

//Acceso al Login


// Ruta para procesar login
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  if (usuario && password) {
    req.session.usuario = usuario; // Guardás el nombre
    res.redirect('/pacientes');
  } else {
    res.status(401).send('Credenciales inválidas');
  }
});


// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
