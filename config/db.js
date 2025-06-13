const mysql = require('mysql2/promise');

let connection;

async function conectar() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        console.log('Conexión correcta.');
    }
    return connection;
}

module.exports = conectar;
