// seeder_cambio_pass_a_hash.js
require('dotenv').config();
const crypto = require('crypto');
const db = require('./config/db');

function hashPasswordNative(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `pbkdf2$${salt}$${hash}`;
}

async function run() {
  try {
    console.log('Iniciando seeder para hashear contraseñas con el hash nativo de Node...');
    
    // Obtener todos los usuarios de la base de datos
    const [usuarios] = await db.execute('SELECT id, nombre, email, pass FROM usuario');
    console.log(`Se encontraron ${usuarios.length} usuarios.`);

    let actualizados = 0;

    for (const user of usuarios) {
      const { id, nombre, email, pass } = user;
      
      // Si la contraseña ya tiene el formato de hash nativo de Node (pbkdf2$...), la saltamos
      if (pass.startsWith('pbkdf2$')) {
        console.log(`Usuario ${nombre} (${email}) ya tiene la contraseña hasheada de forma nativa. Saltando...`);
        continue;
      }

      console.log(`Hasheando contraseña nativa para ${nombre} (${email})...`);
      const hashedPass = hashPasswordNative(pass);

      // Actualizar la contraseña en la base de datos
      await db.execute('UPDATE usuario SET pass = ? WHERE id = ?', [hashedPass, id]);
      actualizados++;
    }

    console.log(`Seeder completado con éxito. Se actualizaron ${actualizados} usuarios.`);
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seeder:', error);
    process.exit(1);
  }
}

run();
