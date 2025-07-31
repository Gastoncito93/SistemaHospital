// controllers/autController.js
const Usuario = require('../models/usuarioModel');

exports.getRegister = (req, res) => {
  res.render('registro', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, pass } = req.body;
    await Usuario.create({ nombre, apellido, dni, email, pass });
    return res.redirect('/login');
  } catch (err) {
    // muestra el mensaje concreto en la vista
    return res.render('registro', { error: err.message });
  }
};

exports.getLogin = (req, res) => {
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
