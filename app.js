const express = require('express');
const path = require('path');
const app = express();

// Rutas
const pacienteRoutes = require('./routes/pacienteRoutes');

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configurar motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (por si usás CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas
app.use('/pacientes', pacienteRoutes);

// Ruta raíz redirige a /pacientes
app.get('/', (req, res) => {
    res.redirect('/pacientes');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
