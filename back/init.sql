-- Script de inicialización de la base de datos
-- Este archivo se puede ejecutar en MySQL Workbench o dejarlo para referencia.
-- Docker creará la BD automáticamente con las variables de entorno.

CREATE DATABASE IF NOT EXISTS inventario_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'inventario_user'@'%' IDENTIFIED BY 'inventario_pass';
GRANT ALL PRIVILEGES ON inventario_db.* TO 'inventario_user'@'%';
FLUSH PRIVILEGES;

USE inventario_db;

-- La tabla la crea Hibernate automáticamente (spring.jpa.hibernate.ddl-auto=update)
-- pero aquí está la estructura de referencia:

CREATE TABLE IF NOT EXISTS productos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL,
    descripcion VARCHAR(500),
    precio      DOUBLE       NOT NULL,
    stock       INT          NOT NULL,
    categoria   VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT IGNORE INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Laptop Dell Inspiron', 'Intel Core i5, 8GB RAM, 256GB SSD', 2800000, 12, 'Electrónica'),
('Mouse Inalámbrico Logitech', 'Mouse ergonómico 2.4GHz', 85000, 35, 'Periféricos'),
('Teclado Mecánico Redragon', 'Switches Blue, RGB', 220000, 20, 'Periféricos'),
('Monitor Samsung 24"', 'Full HD, IPS, 75Hz', 950000, 8, 'Electrónica'),
('Silla Gamer DXRacer', 'Ergonómica, reclinable 135°', 1500000, 5, 'Mobiliario');
