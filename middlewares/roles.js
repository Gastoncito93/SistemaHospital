module.exports = {

  requireRol: (rolesPermitidos = []) => {
    return (req, res, next) => {

      if (!req.session || !req.session.rol) {
        return res.status(403).send("Acceso denegado");
      }

      if (!rolesPermitidos.includes(req.session.rol)) {
        return res.status(403).send("No tenés permisos para esta acción");
      }

      next();
    };
  },

  soloAdmin: (req, res, next) => {
    if (req.session.rol !== 'admin') {
      return res.status(403).send('Acceso denegado');
    }
    next();
  },

  soloMedico: (req, res, next) => {
    if (req.session.rol !== 'medico' && req.session.rol !== 'admin') {
      return res.status(403).send('Acceso solo para médicos');
    }
    next();
  },

  soloEnfermero: (req, res, next) => {
    if (req.session.rol !== 'enfermero' && req.session.rol !== 'admin') {
      return res.status(403).send('Acceso solo para enfermería');
    }
    next();
  }

};
