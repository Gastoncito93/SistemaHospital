-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-05-2025 a las 00:50:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `ala` enum('Norte','Sur') NOT NULL,
  `tipo` enum('individual','doble') NOT NULL,
  `estado` enum('libre','ocupada','limpieza') NOT NULL DEFAULT 'limpieza'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `numero`, `ala`, `tipo`, `estado`) VALUES
(1, 101, 'Norte', 'doble', 'limpieza'),
(2, 102, 'Norte', 'doble', 'libre'),
(3, 103, 'Norte', 'doble', 'limpieza'),
(4, 104, 'Norte', 'doble', 'libre'),
(5, 105, 'Norte', 'doble', 'limpieza'),
(6, 106, 'Norte', 'doble', 'limpieza'),
(7, 107, 'Norte', 'doble', 'limpieza'),
(8, 108, 'Norte', 'doble', 'limpieza'),
(9, 109, 'Norte', 'doble', 'limpieza'),
(10, 110, 'Norte', 'doble', 'libre'),
(11, 201, 'Sur', 'individual', 'limpieza'),
(12, 202, 'Sur', 'individual', 'limpieza'),
(13, 203, 'Sur', 'individual', 'limpieza'),
(14, 204, 'Sur', 'individual', 'limpieza'),
(15, 205, 'Sur', 'individual', 'limpieza'),
(16, 206, 'Sur', 'individual', 'limpieza'),
(17, 207, 'Sur', 'individual', 'limpieza'),
(18, 208, 'Sur', 'individual', 'libre'),
(19, 209, 'Sur', 'individual', 'limpieza'),
(20, 210, 'Sur', 'individual', 'limpieza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internaciones`
--

CREATE TABLE `internaciones` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `motivo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internaciones`
--

INSERT INTO `internaciones` (`id`, `paciente_id`, `habitacion_id`, `fecha_ingreso`, `motivo`) VALUES
(1, 5, 2, '2025-05-10', 'Prueba 1 de internacion'),
(2, 5, 2, '2025-05-10', 'prueba internacion 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `sexo` enum('masculino','femenino') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `sexo`) VALUES
(5, 'Juan', 'Pérez', '12345678', 'masculino'),
(6, 'María', 'Gómez', '23456789', 'femenino'),
(7, 'Carlos', 'López', '34567890', 'masculino'),
(8, 'Laura', 'Fernández', '45678901', 'femenino'),
(9, 'Pedro', 'Martínez', '56789012', 'masculino'),
(10, 'Gaston Oscar', 'Ssoa', '21651621', 'masculino'),
(11, 'Florencia', 'Carreño', '5416514', 'femenino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Indices de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `habitacion_id` (`habitacion_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `internaciones`
--
ALTER TABLE `internaciones`
  ADD CONSTRAINT `internaciones_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_2` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
