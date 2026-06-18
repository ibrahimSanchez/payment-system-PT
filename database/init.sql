-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de tarjetas
CREATE TABLE IF NOT EXISTS tarjetas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_tarjeta VARCHAR(16) UNIQUE NOT NULL,    -- Solo datos ficticios
    titular VARCHAR(100) NOT NULL,
    fecha_vencimiento VARCHAR(7) NOT NULL,  -- Formato: MM/YYYY
    tipo VARCHAR(20) DEFAULT 'credito',     -- credito | debito
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tarjeta_id INTEGER NOT NULL REFERENCES tarjetas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- aprobado | rechazado
    created_at TIMESTAMP DEFAULT NOW()
);