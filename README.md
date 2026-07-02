# Sistema Hospitalario (HIS) - Internación

Este proyecto corresponde al **Trabajo Práctico Integrador (TPI)** para la materia **Programación Web II**. Consiste en un sistema de gestión hospitalaria (HIS) enfocado en el módulo de **Internación**, desarrollado bajo el patrón **MVC (Modelo-Vista-Controlador)** utilizando Node.js, Express, MySQL y PUG.

## 🌐 Enlace del Despliegue (Producción)
La aplicación se encuentra desplegada y operativa en internet en la siguiente dirección:
* **Producción (Railway):** [https://sistemahospital-production.up.railway.app/](https://sistemahospital-production.up.railway.app/)

---

## 🔑 Credenciales de Prueba para Evaluación
De acuerdo a las pautas de evaluación, se proveen cuentas de prueba con contraseñas seguras hasheadas en formato PBKDF2 (nativo de Node.js) correspondientes a cada uno de los roles disponibles:

| Rol | Correo Electrónico | Contraseña | DNI | Estado inicial en el sistema |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `gastonoscarsosa@gmail.com` | `a3s2d1q6w5e4` | `541965165` | Acceso completo a todo el sistema |
| **Médico** | `yacielzombers@gmail.com` | `password123` | `4695161` | Acceso a altas médicas y evaluaciones |
| **Enfermero** | `germanperez@gmail.com` | `password123` | `15651384` | Acceso a controles de enfermería |
| **Pendiente** | `pablogarcia@gmail.com` | `password123` | `9876543` | Bloqueado con pantalla de espera hasta que el Admin le asigne rol |

---

## 🛠️ Tecnologías utilizadas

- **Backend**: Node.js & Express
- **Base de Datos**: MySQL (utilizando la librería `mysql2` con soporte de Promises)
- **Motor de Plantillas**: PUG (renderizado del lado del servidor)
- **Estilos**: Bootstrap (CSS nativo, con componentes personalizados de hospital en color azul, verde, cian y amarillo)
- **Seguridad**: Autenticación nativa basada en sesiones de Express (`express-session`) y hasheo seguro de contraseñas mediante **PBKDF2 Sync**.

---

## 📁 Arquitectura y Estructura del Proyecto

El desarrollo sigue una separación estricta de responsabilidades (Modelo-Vista-Controlador):

- `/config/db.js`: Configuración y pool de conexiones a la base de datos MySQL mediante Promesas.
- `/models/`: Contiene los modelos que interactúan con la base de datos (consultas SQL parametrizadas para evitar Inyecciones SQL).
  - `pacienteModel.js`, `habitacionModel.js`, `internacionModel.js`, `usuarioModel.js`, `estadoModel.js`.
- `/controllers/`: Aloja la lógica de negocio y coordinación de datos.
  - `pacienteController.js`, `habitacionController.js`, `internacionController.js`, `authController.js`, `usuarioController.js`.
- `/routes/`: Define las rutas HTTP y aplica middlewares de seguridad y roles.
  - `pacienteRoutes.js`, `habitacionRoutes.js`, `internacionRoutes.js`, `usuarioRoutes.js`, `authRoutes.js`.
- `/middlewares/roles.js`: Restricción de acceso a rutas específicas según rol de usuario.
- `/views/`: Plantillas PUG organizadas por módulos (pacientes, habitaciones, internaciones, usuarios).
- `his_db.sql`: Backup completo de la base de datos (esquema, relaciones, claves primarias/foráneas, y datos semilla actualizados).

---

## 🚀 Instalación y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Gastoncito93/SistemaHospital.git
cd SistemaHospital
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto y configure sus credenciales de base de datos local:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=his_db
SESSION_SECRET=mi_secreto_super_seguro
PORT=3000
```

### 4. Restaurar la Base de Datos
Importe el archivo `his_db.sql` en su motor MySQL local (phpMyAdmin, MySQL Workbench o consola):
```bash
mysql -u root -p his_db < his_db.sql
```

### 5. Iniciar la aplicación
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📝 Informe de Problemas Encontrados y Soluciones Desarrolladas

Durante la realización del integrador se detectaron varios problemas críticos y áreas de mejora que fueron solucionados para asegurar la robustez, seguridad y usabilidad del software:

1. **Inconsistencia de Contraseñas del Dump**:
   * *Problema*: Los usuarios del backup inicial tenían contraseñas en texto plano, mientras que el controlador utilizaba cifrado, impidiendo el acceso inicial.
   * *Solución*: Se actualizó el dump `his_db.sql` con usuarios semilla con contraseñas correctamente hasheadas mediante PBKDF2 y se documentaron las credenciales en este README.
2. **Habitaciones "Atascadas" como Ocupadas**:
   * *Problema*: Varios registros de habitaciones figuraban como ocupadas a pesar de no haber ningún paciente activo en la tabla `internaciones`. Además, al eliminar internaciones, no se recalculaba el estado de la habitación correspondiente.
   * *Solución*: Se diseñó un script de saneamiento de base de datos para resetear las habitaciones a su estado real, y se actualizaron los controladores de altas y eliminaciones para recalcular dinámicamente y de forma automática el estado de la cama a `'Libre'`, `'Semi-Ocupada'` u `'Ocupada'`.
3. **Pérdida del Estado de Paginación en Pacientes**:
   * *Problema*: Al editar, eliminar o cancelar la edición de un paciente ubicado en la página 3, el navegador recargaba la página devolviendo al usuario a la página 1.
   * *Solución*: Se implementó retención del número de página utilizando parámetros de consulta URL (`?page=3`) en los redireccionamientos del servidor, y se actualizaron dinámicamente los enlaces en el cliente.
4. **Parpadeo y Recarga al Eliminar**:
   * *Problema*: Eliminar un paciente con un botón convencional forzaba a recargar la página completa.
   * *Solución*: Se reescribió el método en el backend para dar soporte a llamadas AJAX (`JSON`), y se implementó lógica asíncrona (`fetch`) en el cliente para desvanecer suavemente la fila del paciente y re-renderizar la tabla de forma instantánea sin refrescar la ventana.
5. **Fusión Inconsistente de Paciente de Emergencia (DNI Duplicado)**:
   * *Problema*: Si un paciente de emergencia ingresaba como NN y luego se descubría su identidad, al asignarle su DNI el sistema intentaba fusionarlo con su registro real histórico. Sin embargo, si ese paciente real ya estaba internado en el hospital, fusionarlo generaría el error lógico de tener a un mismo paciente en dos camas diferentes a la vez.
   * *Solución*: Se agregaron validaciones tanto en el controlador de pacientes como en el de internaciones para bloquear fusiones si el registro de destino ya cuenta con una internación activa.
6. **Actualización Completa de Páginas en Errores de Validación (AJAX)**:
   * *Problema*: Al ingresar datos incorrectos en los formularios de nueva/editar evaluación médica, enfermería y registro de usuarios, la página se recargaba por completo, perdiendo datos y dañando la experiencia de usuario.
   * *Solución*: Se adaptaron los controladores para responder con JSON (`{ success: false, errores }`) y se implementó lógica con Fetch API en el cliente para pintar bordes de color rojo, añadir textos de ayuda bajo los campos con error de forma dinámica, y hacer scroll automático al primer fallo sin recargar la pantalla.
7. **Rangos de Alerta en Signos Vitales (Semaforización)**:
   * *Problema*: En el listado de evaluaciones de enfermería, todos los valores numéricos se mostraban con el mismo estilo, dificultando que el profesional identificara rápidamente signos críticos o de alarma.
   * *Solución*: Se implementó una lógica de semaforización en la plantilla PUG para pintar los valores en verde (normal), amarillo (precaución/límite) o rojo (alerta/crítico) siguiendo estándares médicos para SpO2, Frecuencia Cardíaca, Temperatura, Frecuencia Respiratoria, Dolor y Presión Arterial.
8. **Doble Internación Activa Simultánea**:
   * *Problema*: El sistema permitía internar múltiples veces a un mismo paciente en diferentes habitaciones de forma simultánea.
   * *Solución*: Se añadió una validación en el controlador de internaciones que realiza una consulta SQL antes de guardar para verificar si el paciente ya tiene una internación con fecha de alta pendiente o nula, bloqueando la operación en caso afirmativo.
9. **Bloqueo del Selector de Pacientes y Carga Masiva**:
   * *Problema*: Al abrir el formulario de nueva internación, el navegador cargaba la lista completa de todos los pacientes del hospital, lo cual afectaba el rendimiento.
   * *Solución*: Se bloqueó el selector de pacientes y se añadió una caja de búsqueda. Ahora, el selector solo se activa y busca pacientes de forma dinámica tras escribir al menos **2 caracteres** en la caja.
10. **Error de "Fecha Futura" por Husos Horarios (Timezone Offset)**:
    * *Problema*: Al editar una evaluación, el navegador cargaba la hora en formato UTC a través de `.toISOString()`, lo cual adelantaba la hora 3 horas respecto a la hora local argentina, disparando la validación del backend "La fecha no puede ser futura".
    * *Solución*: Se corrigió restando el `getTimezoneOffset` en minutos convertido a milisegundos antes de invocar el formateador ISO, inicializando de forma precisa los inputs de tipo `datetime-local` en la hora local del cliente.
11. **Falta de Auditoría y Privacidad (Control Cruzado de Evaluaciones)**:
    * *Problema*: El sistema no registraba qué profesional guardaba una evaluación y permitía que cualquier enfermero o médico modificara o eliminara las evoluciones escritas por sus colegas.
    * *Solución*: Se agregó la columna `usuario_id` en las tablas de evaluaciones. Al guardar, se almacena el ID del usuario en sesión y se muestra con un tag en la lista (ej. `👤 Juan Perez`). Adicionalmente, se configuró una restricción de permisos: si el usuario no es el creador de la evaluación (y no es `admin`), los botones se ocultan en el frontend y cualquier acceso manual por URL se bloquea en el backend devolviendo un código **HTTP 403 Forbidden**.
12. **Registros que Reaparecen con el Botón "Atrás" (bfcache)**:
    * *Problema*: Al eliminar una evaluación e ir para atrás con el botón de retroceso del navegador, el registro eliminado volvía a aparecer en pantalla temporalmente debido a la memoria caché.
    * *Solución*: Se inyectaron cabeceras `Cache-Control` globales para evitar el cacheo y se añadió un detector del evento `pageshow` en JavaScript que recarga forzosamente la vista actual si se detecta navegación proveniente de la caché del historial.
13. **Fuerza de Contraseña y Bloqueo de Login por Intentos Fallidos**:
    * *Problema*: El registro de usuarios aceptaba contraseñas débiles y el inicio de sesión era vulnerable a ataques repetidos.
    * *Solución*: Se añadieron validaciones de complejidad en el registro (mínimo una mayúscula, una minúscula, un número y un símbolo especial). Asimismo, se agregaron columnas de seguridad en la tabla `usuario` para bloquear cuentas de rol `medico` o `enfermero` por un lapso de **30 minutos** si ingresan credenciales incorrectas en **3 intentos seguidos**.
