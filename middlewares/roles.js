module.exports = {

  requerirLogin: (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.redirect('/login');
    }
    next();
  },

  requireRol: (rolesPermitidos = []) => {
    return (req, res, next) => {

      if (!req.session || !req.session.rol) {
        return res.redirect('/internaciones?error=Acceso denegado: inicie sesión');
      }

      if (!rolesPermitidos.includes(req.session.rol)) {
        return res.redirect('/internaciones?error=Acceso denegado: no tenés permisos para esta acción');
      }

      next();
    };
  },

  soloAdmin: (req, res, next) => {
    if (req.session.rol !== 'admin') {
      return res.redirect('/internaciones?error=Acceso denegado: se requieren permisos de administrador');
    }
    next();
  },

  soloMedico: (req, res, next) => {
    if (req.session.rol !== 'medico' && req.session.rol !== 'admin') {
      return res.redirect('/internaciones?error=Acceso denegado: sección exclusiva para médicos');
    }
    next();
  },

  soloEnfermero: (req, res, next) => {
    if (req.session.rol !== 'enfermero' && req.session.rol !== 'admin') {
      return res.redirect('/internaciones?error=Acceso denegado: sección exclusiva para enfermería');
    }
    next();
  }

};
