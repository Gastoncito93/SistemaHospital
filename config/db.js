const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    password: '',        
    database: 'his_db',
    port: 3306
});

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('Conexion Correcta.');
    }
});

connection.end();

module.exports = connection;
