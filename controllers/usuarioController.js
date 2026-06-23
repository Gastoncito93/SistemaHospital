const Usuario = require('../models/usuarioModel');

module.exports = {

  // 📌 Listar usuarios (solo admin)
  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();

      res.render('usuarios/lista', {
        usuarios
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar usuarios');
    }
  },

  // 📌 Cambiar rol (solo admin)
  actualizarRol: async (req, res) => {
    try {
      const { id } = req.params;
      const { rol } = req.body;

      // ❌ Bloquear auto-edición
      if (parseInt(id) === req.session.userId) {
        return res.status(403).send('No podés cambiar tu propio rol');
      }

      await Usuario.actualizarRol(id, rol);

      res.redirect('/usuarios');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar rol');
    }
  }

};
