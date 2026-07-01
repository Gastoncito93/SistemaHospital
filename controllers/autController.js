// controllers/autController.js
const Usuario = require('../models/usuarioModel');

exports.getRegister = (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/pacientes');
  }
  res.render('registro', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, pass } = req.body;
    
    // Validación básica de campos vacíos
    if (!nombre || !apellido || !dni || !email || !pass) {
      return res.render('registro', { error: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.render('registro', { error: 'El correo electrónico ya está registrado.' });
    }

    // Crear el usuario con rol por defecto 'pendiente'
    await Usuario.create({ nombre, apellido, dni, email, pass, rol: 'pendiente' });
    return res.redirect('/login?success=Registro exitoso. Su cuenta está pendiente de aprobación por un administrador.');
  } catch (err) {
    console.error('Error en postRegister:', err);
    return res.render('registro', { error: 'Ocurrió un error al procesar el registro. Intente nuevamente.' });
  }
};

exports.getLogin = (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/pacientes');
  }
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await Usuario.findByCredentials(email, pass);
    if (!user) {
      return res.render('login', { error: 'Credenciales inválidas' });
    }
    // guardamos el usuario en sesión
    req.session.userId   = user.id;
    req.session.usuario  = user.nombre;
    req.session.rol      = user.rol;
    // redirigimos a /pacientes (ten en cuenta que en app.js montas pacienteRoutes en '/pacientes')
    return res.redirect('/pacientes');
  } catch (err) {
    console.error(err);
    return res.render('login', { error: 'Error al iniciar sesión' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

exports.getPendiente = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  if (req.session.rol !== 'pendiente') {
    return res.redirect('/pacientes');
  }
  res.render('pendiente');
};
