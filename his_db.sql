-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-06-2026 a las 16:23:37
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
-- Estructura de tabla para la tabla `alas`
--

CREATE TABLE `alas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alas`
--

INSERT INTO `alas` (`id`, `nombre`) VALUES
(1, 'Norte'),
(2, 'Sur');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id`, `nombre`) VALUES
(1, 'Libre'),
(3, 'Limpieza'),
(2, 'Ocupada'),
(4, 'Semi-Ocupada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_enfermeria`
--

CREATE TABLE `evaluaciones_enfermeria` (
  `id` int(11) NOT NULL,
  `internacion_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `presion_arterial` varchar(20) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `saturacion_oxigeno` tinyint(4) DEFAULT NULL,
  `dolor` tinyint(4) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `sintomas` text DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `medicacion_actual` text DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evaluaciones_enfermeria`
--

INSERT INTO `evaluaciones_enfermeria` (`id`, `internacion_id`, `fecha_hora`, `presion_arterial`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `temperatura`, `saturacion_oxigeno`, `dolor`, `motivo`, `sintomas`, `alergias`, `medicacion_actual`, `notas`) VALUES
(2, 12, '2025-06-04 23:30:00', '118/76', 82, 17, 37.0, 97, 3, 'Seguimiento', 'Refiere leve cansancio', 'Ninguna', 'Paracetamol 500mg', 'Sin cambios'),
(5, 14, '2025-06-05 10:20:00', '125/85', 88, 20, 37.8, 96, 5, 'Evaluación por dolor', 'Dolor torácico moderado', 'Penicilina', 'Ninguna', 'Se avisa a médico'),
(6, 15, '2025-06-13 08:45:00', '130/88', 90, 22, 38.2, 95, 6, 'Control urgente', 'Fiebre y disnea', 'Ninguna', 'Amoxicilina 875mg', 'Oxígeno suplementario'),
(7, 15, '2025-06-13 12:00:00', '128/86', 88, 20, 37.5, 96, 4, 'Seguimiento febril', 'Sudoración, fatiga', 'Ninguna', 'Amoxicilina 875mg', 'Reduce la fiebre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_medicas`
--

CREATE TABLE `evaluaciones_medicas` (
  `id` int(11) NOT NULL,
  `internacion_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `diagnostico` text NOT NULL,
  `evolucion` text NOT NULL,
  `tratamiento` text NOT NULL,
  `medicacion` text NOT NULL,
  `estudios_solicitados` text DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evaluaciones_medicas`
--

INSERT INTO `evaluaciones_medicas` (`id`, `internacion_id`, `fecha_hora`, `diagnostico`, `evolucion`, `tratamiento`, `medicacion`, `estudios_solicitados`, `notas`) VALUES
(10, 24, '2026-06-11 16:56:00', 'sryery', 'erherasfdasfasfasf', 'erherh', 'etrheth', 'etheth', 'etheth');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `ala_id` int(11) NOT NULL,
  `tipo_id` int(11) NOT NULL,
  `estado_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `numero`, `ala_id`, `tipo_id`, `estado_id`) VALUES
(21, 101, 1, 1, 2),
(22, 102, 1, 2, 2),
(23, 103, 1, 1, 2),
(24, 201, 2, 2, 2),
(25, 202, 2, 1, 2),
(28, 108, 1, 2, 2),
(41, 109, 1, 2, 2),
(45, 107, 2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internaciones`
--

CREATE TABLE `internaciones` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `habitacion_id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `motivo` text NOT NULL,
  `tipo_ingreso` varchar(50) NOT NULL,
  `origen_paciente` varchar(50) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `motivo_alta` varchar(255) DEFAULT NULL,
  `estado_internacion` varchar(20) DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internaciones`
--

INSERT INTO `internaciones` (`id`, `paciente_id`, `habitacion_id`, `fecha_ingreso`, `motivo`, `tipo_ingreso`, `origen_paciente`, `observaciones`, `fecha_alta`, `motivo_alta`, `estado_internacion`) VALUES
(12, 5, 21, '2025-06-04', 'Hombre en la 101', '', '', NULL, NULL, NULL, 'activa'),
(14, 8, 24, '2025-06-05', 'mujer 2 en 201\r\n', '', '', NULL, NULL, NULL, 'activa'),
(15, 7, 24, '2025-06-13', 'Se debe internar Urgente', 'Guardia', 'Domicilio', 'obs', NULL, NULL, 'activa'),
(24, 25, 41, '2026-06-23', 'asfasf', 'Guardia', 'Domicilio', 'asfasf', NULL, NULL, 'activa'),
(25, 22, 41, '2026-06-23', 'asd', 'Guardia', 'Domicilio', 'adf', NULL, NULL, 'activa');

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
(7, 'Carlos', 'López', '34567890', 'femenino'),
(8, 'Laura', 'Fernández', '45678901', 'femenino'),
(9, 'Pedro', 'Martínez', '56789012', 'masculino'),
(12, 'Yaciel', 'Muñoz', '51651651', 'masculino'),
(17, 'Gaston Oscar', 'Sosa', '37090426', 'masculino'),
(19, 'Gaston', 'Sosa', '37090426', 'masculino'),
(22, 'yaciel', 'muñoz', '51951', 'femenino'),
(23, 'Gaston', 'Sosa', '1214134134', 'masculino'),
(25, 'Martin', 'Gontero', '51651651', 'femenino'),
(26, 'wrt', 'wwrg', '9154915', 'masculino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos`
--

CREATE TABLE `tipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos`
--

INSERT INTO `tipos` (`id`, `nombre`) VALUES
(2, 'doble'),
(1, 'individual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rol` enum('admin','medico','enfermero','pendiente') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `dni`, `email`, `pass`, `created_at`, `rol`) VALUES
(2, 'Gaston', 'Sosa', '541965165', 'gastonoscarsosa@gmail.com', 'pbkdf2$11317e224f4c5cca86c74631b0ec4399$68b7267578cfea14890f81b7d637572840f17d9de0b7f52572d44f3a606df01011501a577dd330eb04c903fcc4e86af696fc19dbd05071ceebb348bb4b0fa6ff', '2025-07-30 18:40:09', 'admin'),
(3, 'German', 'Perez', '15651384', 'germanperez@gmail.com', 'pbkdf2$0f938c211ccf1c0c9fe62f58f87e4293$3b18adcceb7e847a1033ccca50e246ad3f198864bdefc7f7b0ef7a6794cc0b2d3338d8d3d03d19cfaf706b24ac1d2195fcdec51ca3d5c025becf4406966de21b', '2025-11-14 21:46:33', 'enfermero'),
(4, 'Yaciel', 'Muñoz', '4695161', 'yacielzombers@gmail.com', 'pbkdf2$d913d22f6d7133bfba74a13d0388bf34$9b8726c9a846d038c2fb7541aaef641a53ff2ff790d4709cb5c597833735361cd6e9be6972b4505a53ec711597106e39946fc64123e11288dac729ebbfad3e52', '2025-12-04 20:20:42', 'medico'),
(5, 'Pablo', 'Garcia', '9876543', 'pablogarcia@gmail.com', 'pbkdf2$7a08f0847d1b6c562918a027163c0ae7$f94b3d48ce2aadb06002c73721eea88da05a0ba01018024842b5696133dbe2b758a742c3e9396f7daf994c615bd325bef514eca3c8cf0fc8bb358c2b47f28eaa', '2026-07-01 02:40:00', 'pendiente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eval_enf_internacion` (`internacion_id`);

--
-- Indices de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eval_med_internacion` (`internacion_id`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `fk_ala` (`ala_id`),
  ADD KEY `fk_tipo` (`tipo_id`),
  ADD KEY `fk_estado` (`estado_id`);

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
-- Indices de la tabla `tipos`
--
ALTER TABLE `tipos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alas`
--
ALTER TABLE `alas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `internaciones`
--
ALTER TABLE `internaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `tipos`
--
ALTER TABLE `tipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `evaluaciones_enfermeria`
--
ALTER TABLE `evaluaciones_enfermeria`
  ADD CONSTRAINT `fk_eval_enf_internacion` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluaciones_medicas`
--
ALTER TABLE `evaluaciones_medicas`
  ADD CONSTRAINT `fk_eval_med_internacion` FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `fk_ala` FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`),
  ADD CONSTRAINT `fk_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `fk_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`);

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
