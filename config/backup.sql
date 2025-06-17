-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS his_db;
USE his_db;

-- Tabla: alas
DROP TABLE IF EXISTS alas;
CREATE TABLE alas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO alas (id, nombre) VALUES
  (1, 'Norte'),
  (2, 'Sur');

-- Tabla: estados
DROP TABLE IF EXISTS estados;
CREATE TABLE estados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO estados (id, nombre) VALUES
  (1, 'Libre'),
  (3, 'Limpieza'),
  (2, 'Ocupada'),
  (4, 'Semi-Ocupada');

-- Tabla: tipos
DROP TABLE IF EXISTS tipos;
CREATE TABLE tipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO tipos (id, nombre) VALUES
  (2, 'doble'),
  (1, 'individual');

-- Tabla: pacientes
DROP TABLE IF EXISTS pacientes;
CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  dni VARCHAR(15),
  sexo ENUM('masculino', 'femenino')
);
INSERT INTO pacientes (id, nombre, apellido, dni, sexo) VALUES
  (5, 'Juan', 'Pérez', '12345678', 'masculino'),
  (6, 'María', 'Gómez', '23456789', 'femenino'),
  (7, 'Carlos', 'López', '34567890', 'masculino'),
  (8, 'Laura', 'Fernández', '45678901', 'femenino'),
  (9, 'Pedro', 'Martínez', '56789012', 'masculino'),
  (10, 'German Oscar', 'Sosa', '21651621', 'masculino'),
  (12, 'Yaciel', 'Muñoz', '51651651', 'masculino'),
  (14, 'Flor', 'Carreño', '16516521', 'femenino'),
  (15, 'Gaston Oscar', 'Sosa ', '37090426', 'masculino'),
  (29, 'German ', 'Perez', '321321321', 'masculino'),
  (31, 'Gaston', 'Sosa Carreño Flor', '37090465', 'masculino');

-- Tabla: habitaciones
DROP TABLE IF EXISTS habitaciones;
CREATE TABLE habitaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  ala_id INT NOT NULL,
  tipo_id INT NOT NULL,
  estado_id INT NOT NULL,
  FOREIGN KEY (ala_id) REFERENCES alas(id),
  FOREIGN KEY (tipo_id) REFERENCES tipos(id),
  FOREIGN KEY (estado_id) REFERENCES estados(id)
);
INSERT INTO habitaciones (id, numero, ala_id, tipo_id, estado_id) VALUES
  (21, 101, 1, 1, 2),
  (22, 102, 1, 2, 1),
  (23, 103, 1, 1, 1),
  (24, 201, 2, 2, 1),
  (25, 202, 2, 1, 1),
  (28, 108, 1, 2, 1),
  (29, 1025, 1, 1, 1);

-- Tabla: internaciones
DROP TABLE IF EXISTS internaciones;
CREATE TABLE internaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  habitacion_id INT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  motivo TEXT NOT NULL,
  via_ingreso_id INT DEFAULT NULL,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE
);
INSERT INTO internaciones (id, paciente_id, habitacion_id, fecha_ingreso, motivo, via_ingreso_id) VALUES
  (16, 5, 23, '2025-06-18', 'Espera del Enfermero', NULL),
  (17, 6, 22, '2025-06-05', 'Internacion/ Cirujia', NULL);
