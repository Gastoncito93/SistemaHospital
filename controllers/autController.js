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
  const user = await Usuario.findByCredentials(email, pass);
  if (user) {
    req.session.userId = user.id;
    // Redirige ahora a la página de pacientes
    return res.redirect('/pacientes');
  } else {
    return res.render('login', { error: 'Credenciales inválidas' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
