const Enfermeria = require('../models/enfermeriaModel');
const Internacion = require('../models/internacionModel');
const Paciente = require('../models/pacienteModel');
const Habitacion = require('../models/habitacionModel');

function validarEvaluacion(data) {
  const errores = {};

  const presionRegex = /^\d{2,3}\/\d{2,3}$/;
  if (!presionRegex.test(data.presion_arterial)) {
    errores.presion_arterial = "La presión debe tener formato 120/80";
  } else {
    const [sis, dia] = data.presion_arterial.split("/").map(Number);
    if (sis < 50 || sis > 260 || dia < 30 || dia > 150) {
      errores.presion_arterial = "La presión debe estar entre 50-260 / 30-150";
    }
  }

  if (isNaN(data.frecuencia_cardiaca) || data.frecuencia_cardiaca < 20 || data.frecuencia_cardiaca > 240) {
    errores.frecuencia_cardiaca = "La FC debe ser entre 20 y 240 lpm";
  }

  if (isNaN(data.frecuencia_respiratoria) || data.frecuencia_respiratoria < 6 || data.frecuencia_respiratoria > 60) {
    errores.frecuencia_respiratoria = "La FR debe ser entre 6 y 60 rpm";
  }

  if (isNaN(data.temperatura) || data.temperatura < 28 || data.temperatura > 43) {
    errores.temperatura = "La temperatura debe ser entre 28 y 43 °C";
  }

  if (isNaN(data.saturacion_oxigeno) || data.saturacion_oxigeno < 50 || data.saturacion_oxigeno > 100) {
    errores.saturacion_oxigeno = "La SpO2 debe estar entre 50% y 100%";
  }

  if (isNaN(data.dolor) || data.dolor < 1 || data.dolor > 10) {
    errores.dolor = "El nivel de dolor debe estar entre 1 y 10";
  }

  return errores;
}



module.exports = {

    

  // 📌 Lista las evaluaciones de una internación
  listarPorInternacion: async (req, res) => {
  try {
    const internacionId = req.params.internacionId;

    // ⚠ Validamos que exista el ID
    if (!internacionId || internacionId === "undefined") {
      return res.status(400).send("ID de internación no válido");
    }

    const internacion = await Internacion.obtenerPorId(internacionId);

    // ⚠ Validamos que la internación exista
    if (!internacion) {
      return res.status(404).send("Internación no encontrada");
    }

    const evaluaciones = await Enfermeria.obtenerPorInternacion(internacionId);

    res.render('enfermeria/lista', {
      internacion,
      evaluaciones
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar evaluaciones de enfermería");
  }
},



  // 📌 Formulario para registrar nueva evaluación
  mostrarFormularioNuevo: async (req, res) => {
  try {
    const internacionId = req.params.internacionId;

    // Si no hay ID, NO seguir
    if (!internacionId || internacionId === "undefined") {
      return res.send("ERROR: Debe acceder desde una internación válida.");
    }

    const internacion = await Internacion.obtenerPorId(internacionId);

    if (!internacion) {
      return res.send("ERROR: La internación no existe.");
    }

    res.render('enfermeria/nueva', { internacion });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar formulario de enfermería");
  }
},
    

  // 📌 Registrar nueva evaluación
  guardar: async (req, res) => {
  try {
    const errores = validarEvaluacion(req.body);

    if (Object.keys(errores).length > 0) {
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(400).json({ success: false, errores });
      }
      const internacion = await Internacion.obtenerPorId(req.body.internacion_id);

      return res.render("enfermeria/nueva", {
        errores,
        datos: req.body,
        internacion
      });
    }

    req.body.usuario_id = req.session.userId || null;
    await Enfermeria.insertar(req.body);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.json({ success: true, redirectUrl: `/enfermeria/internacion/${req.body.internacion_id}` });
    }
    res.redirect(`/enfermeria/internacion/${req.body.internacion_id}`);

  } catch (error) {
    console.error(error);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ success: false, message: "Error al guardar evaluación de enfermería" });
    }
    res.status(500).send("Error al guardar evaluación de enfermería");
  }
},




  mostrarFormularioEditar: async (req, res) => {
    try {
      const id = req.params.id;
      const evaluacion = await Enfermeria.obtenerPorId(id);

      if (!evaluacion) {
        return res.status(404).send("Evaluación no encontrada");
      }

      // Restricción: solo el creador o un admin pueden editar
      if (req.session.rol !== 'admin' && evaluacion.usuario_id !== req.session.userId) {
        return res.status(403).send("No tiene permisos para editar esta evaluación");
      }

      res.render('enfermeria/editar', { evaluacion });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar evaluación para edición");
    }
  },

  actualizar: async (req, res) => {
  try {
    const id = req.params.id;
    const evaluacionExistente = await Enfermeria.obtenerPorId(id);
    if (!evaluacionExistente) {
      return res.status(404).send("Evaluación no encontrada");
    }

    // Restricción: solo el creador o un admin pueden actualizar
    if (req.session.rol !== 'admin' && evaluacionExistente.usuario_id !== req.session.userId) {
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ success: false, message: "No tiene permisos para editar esta evaluación" });
      }
      return res.status(403).send("No tiene permisos para editar esta evaluación");
    }

    const errores = validarEvaluacion(req.body);

    if (Object.keys(errores).length > 0) {
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(400).json({ success: false, errores });
      }
      const evaluacion = await Enfermeria.obtenerPorId(req.params.id);

      return res.render("enfermeria/editar", {
        errores,
        datos: req.body,
        evaluacion
      });
    }

    await Enfermeria.actualizar(req.params.id, req.body);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.json({ success: true, redirectUrl: `/enfermeria/internacion/${req.body.internacion_id}` });
    }
    res.redirect(`/enfermeria/internacion/${req.body.internacion_id}`);

  } catch (error) {
    console.error(error);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ success: false, message: "Error al actualizar evaluación" });
    }
    res.status(500).send("Error al actualizar evaluación");
  }
},



  
    eliminar: async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Buscar la evaluación primero
    const evaluacion = await Enfermeria.obtenerPorId(id);

    if (!evaluacion) {
      return res.redirect('/internaciones');
    }

    // Restricción: solo el creador o un admin pueden eliminar
    if (req.session.rol !== 'admin' && evaluacion.usuario_id !== req.session.userId) {
      return res.status(403).send("No tiene permisos para eliminar esta evaluación");
    }

    const internacionId = evaluacion.internacion_id;

    // 2. Borrar
    await Enfermeria.eliminar(id);

    // 3. Redirigir SIEMPRE al listado de esa internación
    res.redirect(`/enfermeria/internacion/${internacionId}`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar evaluación");
  }
}

};
