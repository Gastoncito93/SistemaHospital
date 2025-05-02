const mysql = require('mysql2/promise');

let connection;

async function conectar() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'his_db',
            port: 3306
        });
        console.log('Conexión correcta.');
    }
    return connection;
}

module.exports = conectar;
