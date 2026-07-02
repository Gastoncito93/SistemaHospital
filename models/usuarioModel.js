// models/usuarioModel.js
const db = require('../config/db');
const crypto = require('crypto');

// Función nativa para hashear usando pbkdf2
function hashPasswordNative(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `pbkdf2$${salt}$${hash}`;
}

// Función nativa para verificar contraseñas
function verifyPassword(password, storedPassword) {
  // 1. Si es formato PBKDF2 nativo de Node
  if (storedPassword.startsWith('pbkdf2$')) {
    const [, salt, originalHash] = storedPassword.split('$');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }
  
  // 2. Si es formato bcrypt (por compatibilidad por si quedó alguno)
  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, storedPassword);
  }
  
  // 3. Si es texto plano
  return password === storedPassword;
}

const Usuario = {
  create: async ({ nombre, apellido, dni, email, pass, rol }) => {
    // Hashear la contraseña antes de guardarla en la base de datos con el hash propio de Node
    const hashedPass = hashPasswordNative(pass);

    const [result] = await db.execute(
      `INSERT INTO usuario (nombre, apellido, dni, email, pass, rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, dni, email, hashedPass, rol || 'pendiente']
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute(
      `SELECT * FROM usuario WHERE email = ?`,
      [email]
    );
    return rows[0];
  },

  findByCredentials: async (email, pass) => {
    // Seleccionamos también la contraseña para poder verificarla
    const [rows] = await db.execute(
      `SELECT id, nombre, pass, rol
       FROM usuario
       WHERE email = ?`,
      [email]
    );
    
    const user = rows[0];
    if (!user) return null;

    // Verificar contraseña usando nuestra función compatible
    const passwordMatches = verifyPassword(pass, user.pass);
    if (!passwordMatches) return null;

    // Eliminar la contraseña del objeto antes de retornarlo por seguridad
    delete user.pass;
    return user;
  }
};

Usuario.obtenerTodos = async () => {
  const [rows] = await db.execute(
    `SELECT id, nombre, apellido, email, rol
     FROM usuario
     ORDER BY apellido, nombre`
  );
  return rows;
};

// 🔹 Actualizar rol de un usuario
Usuario.actualizarRol = async (id, rol) => {
  await db.execute(
    `UPDATE usuario SET rol = ? WHERE id = ?`,
    [rol, id]
  );
};

// 🔹 Métodos de seguridad para login (bloqueo por intentos fallidos)
Usuario.verificarPassword = (password, storedPassword) => {
  return verifyPassword(password, storedPassword);
};

Usuario.incrementarIntentos = async (id) => {
  await db.execute(
    `UPDATE usuario SET intentos_fallidos = intentos_fallidos + 1 WHERE id = ?`,
    [id]
  );
};

Usuario.bloquearUsuario = async (id, minutos) => {
  const fechaBloqueo = new Date(Date.now() + minutos * 60000);
  await db.execute(
    `UPDATE usuario SET bloqueado_hasta = ? WHERE id = ?`,
    [fechaBloqueo, id]
  );
};

Usuario.resetearIntentos = async (id) => {
  await db.execute(
    `UPDATE usuario SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?`,
    [id]
  );
};

module.exports = Usuario;
