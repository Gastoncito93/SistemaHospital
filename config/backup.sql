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
  sexo ENUM('masculino', 'femenino') NOT NULL,
);

-- Datos de prueba
INSERT INTO pacientes (nombre, apellido, dni, sexo) VALUES 
('Juan', 'Pérez', '12345678','masculino'),
('María', 'López', '23456789','femenino'),
('Carlos', 'García', '34567890','masculino'),
('Ana', 'Martínez', '45678901','femenino'),
('Pedro', 'Sánchez', '56789012','masculino'),
('Laura', 'Fernández', '67890123','femenino'),
('Javier', 'Ramírez', '78901234','masculino'),
('Lucía', 'Torres', '89012345','femenino'),
('Diego', 'Hernández', '90123456','masculino');
