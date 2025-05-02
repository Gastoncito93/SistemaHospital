-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS his_db;
USE his_db;

-- Tabla de pacientes
DROP TABLE IF EXISTS pacientes;
CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  dni VARCHAR(20) NOT NULL
);

-- Datos de prueba
INSERT INTO pacientes (nombre, apellido, dni) VALUES 
('Juan', 'Pérez', '12345678'),
('Ana', 'Gómez', '87654321'),
('Luis', 'Martínez', '11223344');
