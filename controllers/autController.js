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
    
    const errores = {};
    if (!nombre?.trim()) errores.nombre = 'El nombre es obligatorio.';
    if (!apellido?.trim()) errores.apellido = 'El apellido es obligatorio.';
    if (!dni?.trim()) errores.dni = 'El DNI es obligatorio.';
    if (!email?.trim()) errores.email = 'El correo es obligatorio.';
    
    if (!pass) {
      errores.pass = 'La contraseña es obligatoria.';
    } else {
      const hasUppercase = /[A-Z]/.test(pass);
      const hasLowercase = /[a-z]/.test(pass);
      const hasDigit = /\d/.test(pass);
      const hasSymbol = /[^A-Za-z0-9]/.test(pass);
      if (!hasUppercase || !hasLowercase || !hasDigit || !hasSymbol) {
        errores.pass = 'Debe contener al menos una mayúscula, una minúscula, un número y un símbolo.';
      }
    }

    if (Object.keys(errores).length > 0) {
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(400).json({ success: false, errores });
      }
      return res.render('registro', { error: 'Verifique los campos.', errores });
    }

    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(400).json({ success: false, errores: { email: 'El correo electrónico ya está registrado.' } });
      }
      return res.render('registro', { error: 'El correo electrónico ya está registrado.' });
    }

    // Crear el usuario con rol por defecto 'pendiente'
    await Usuario.create({ nombre, apellido, dni, email, pass, rol: 'pendiente' });
    
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.json({ success: true, redirectUrl: '/login?success=Registro exitoso. Su cuenta está pendiente de aprobación por un administrador.' });
    }
    return res.redirect('/login?success=Registro exitoso. Su cuenta está pendiente de aprobación por un administrador.');
  } catch (err) {
    console.error('Error en postRegister:', err);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ success: false, message: 'Ocurrió un error al procesar el registro. Intente nuevamente.' });
    }
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
    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    // 1. Verificar si el usuario está bloqueado actualmente
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      const restTime = Math.ceil((new Date(user.bloqueado_hasta) - new Date()) / 60000);
      return res.render('login', { 
        error: `Esta cuenta se encuentra bloqueada por exceso de intentos fallidos. Intente nuevamente en ${restTime} minutos.` 
      });
    }

    // 2. Verificar contraseña
    const passwordMatches = Usuario.verificarPassword(pass, user.pass);
    
    if (!passwordMatches) {
      // Si es médico o enfermero, registrar el intento fallido
      if (user.rol === 'medico' || user.rol === 'enfermero') {
        await Usuario.incrementarIntentos(user.id);
        
        // Obtener el registro fresco de intentos
        const userFresco = await Usuario.findByEmail(email);
        const intentosRestantes = 3 - userFresco.intentos_fallidos;
        
        if (userFresco.intentos_fallidos >= 3) {
          await Usuario.bloquearUsuario(user.id, 30); // bloquear por 30 minutos
          return res.render('login', { 
            error: 'Has superado los 3 intentos fallidos. Tu cuenta ha sido bloqueada por 30 minutos.' 
          });
        } else {
          return res.render('login', { 
            error: `Credenciales inválidas. Le quedan ${intentosRestantes} intentos antes de bloquear la cuenta.` 
          });
        }
      }
      
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    // 3. Login exitoso -> Resetear intentos fallidos y bloquear
    await Usuario.resetearIntentos(user.id);

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
