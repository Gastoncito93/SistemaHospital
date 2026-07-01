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

Durante la realización del integrador se detectaron varios problemas críticos que fueron solucionados para asegurar la robustez y calidad del software:

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
