const EvaluacionMedica = require('../models/evaluacionMedicaModel');
const Internacion = require('../models/internacionModel');

module.exports = {

  // 📌 LISTAR todas las evaluaciones médicas de una internación
  listarPorInternacion: async (req, res) => {
    try {
      const internacionId = req.params.internacionId;

      const internacion = await Internacion.obtenerPorId(internacionId);
      if (!internacion) {
        return res.status(404).send("Internación no encontrada");
      }

      const evaluaciones = await EvaluacionMedica.obtenerPorInternacion(internacionId);

      res.render('medico/lista', {
        internacion,
        evaluaciones
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar evaluaciones médicas");
    }
  },

  // 📌 FORMULARIO NUEVA evaluación médica
  mostrarFormularioNuevo: async (req, res) => {
    try {
      const internacionId = req.params.internacionId;
      const internacion = await Internacion.obtenerPorId(internacionId);

      if (!internacion) {
        return res.status(404).send("Internación no encontrada");
      }

      res.render('medico/nueva', {
        internacion,
        errors: null,
        datos: {}
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar formulario médico");
    }
  },

  // 📌 GUARDAR nueva evaluación médica
  guardar: async (req, res) => {
  try {
    const datos = req.body;
    const errors = {};

    // ============================
    // VALIDACIONES
    // ============================

    // Fecha obligatoria y no futura
    if (!datos.fecha_hora) {
      errors.fecha_hora = "Debe ingresar fecha y hora.";
    } else if (new Date(datos.fecha_hora) > new Date()) {
      errors.fecha_hora = "La fecha no puede ser futura.";
    }

    // Diagnóstico mínimo 5 caracteres
    if (!datos.diagnostico?.trim()) {
      errors.diagnostico = "Debe ingresar un diagnóstico.";
    } else if (datos.diagnostico.trim().length < 5) {
      errors.diagnostico = "El diagnóstico debe tener al menos 5 caracteres.";
    }

    // Evolución mínima 10 caracteres
    if (!datos.evolucion?.trim()) {
      errors.evolucion = "Debe ingresar la evolución.";
    } else if (datos.evolucion.trim().length < 10) {
      errors.evolucion = "La evolución debe tener al menos 10 caracteres.";
    }

    // Tratamiento obligatorio
    if (!datos.tratamiento?.trim()) {
      errors.tratamiento = "Debe ingresar un tratamiento.";
    }

    // Medicación obligatoria
    if (!datos.medicacion?.trim()) {
      errors.medicacion = "Debe ingresar la medicación.";
    }

    // Notas opcionales pero no más de 500 caracteres
    if (datos.notas && datos.notas.length > 500) {
      errors.notas = "Las notas no pueden superar los 500 caracteres.";
    }

    // SI HAY ERRORES, RE-RENDERIZAR FORMULARIO
    if (Object.keys(errors).length > 0) {
      const internacion = await Internacion.obtenerPorId(datos.internacion_id);
      return res.render("medico/nueva", {
        internacion,
        errores: errors,
        datos
      });
    }

    // ============================
    // INSERTAR EN BD
    // ============================
    await EvaluacionMedica.insertar(datos);

    res.redirect(`/medico/internacion/${datos.internacion_id}`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar evaluación médica");
  }
},


  // 📌 FORMULARIO EDITAR evaluación médica
  mostrarFormularioEditar: async (req, res) => {
    try {
      const id = req.params.id;

      const evaluacion = await EvaluacionMedica.obtenerPorId(id);
      if (!evaluacion) {
        return res.status(404).send("Evaluación no encontrada");
      }

      res.render("medico/editar", {
        evaluacion,
        errors: null
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar evaluación médica");
    }
  },

  // 📌 GUARDAR edición
  actualizar: async (req, res) => {
  try {
    const id = req.params.id;
    const datos = req.body;

    const errors = {};

    // Fecha válida
    if (!datos.fecha_hora) {
      errors.fecha_hora = "Debe ingresar fecha y hora.";
    } else if (new Date(datos.fecha_hora) > new Date()) {
      errors.fecha_hora = "La fecha no puede ser futura.";
    }

    // Diagnóstico mínimo
    if (!datos.diagnostico?.trim()) {
      errors.diagnostico = "Debe ingresar diagnóstico.";
    } else if (datos.diagnostico.trim().length < 5) {
      errors.diagnostico = "El diagnóstico debe tener al menos 5 caracteres.";
    }

    // Evolución mínima
    if (!datos.evolucion?.trim()) {
      errors.evolucion = "Debe ingresar evolución.";
    } else if (datos.evolucion.trim().length < 10) {
      errors.evolucion = "La evolución debe tener al menos 10 caracteres.";
    }

    // Tratamiento obligatorio
    if (!datos.tratamiento?.trim()) {
      errors.tratamiento = "Debe ingresar un tratamiento.";
    }

    // Medicación obligatoria
    if (!datos.medicacion?.trim()) {
      errors.medicacion = "Debe ingresar la medicación.";
    }

    // Notas opcionales pero límite
    if (datos.notas && datos.notas.length > 500) {
      errors.notas = "Las notas no pueden superar los 500 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
      const evaluacion = await EvaluacionMedica.obtenerPorId(id);
      return res.render("medico/editar", {
        evaluacion: { ...evaluacion, ...datos },
        errors
      });
    }

    await EvaluacionMedica.actualizar(id, datos);

    res.redirect(`/medico/internacion/${datos.internacion_id}`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar evaluación médica");
  }
},


  // 📌 ELIMINAR evaluación médica
eliminar: async (req, res) => {
  try {
    const id = req.params.id;

    // Obtener evaluación antes de borrar
    const evaluacion = await EvaluacionMedica.obtenerPorId(id);

    if (!evaluacion) {
      return res.status(404).send("Evaluación no encontrada");
    }

    const internacionId = evaluacion.internacion_id;

    // Eliminar registro
    await EvaluacionMedica.eliminar(id);

    // Redirigir correctamente
    res.redirect(`/medico/internacion/${internacionId}`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar evaluación médica");
  }
}


};
