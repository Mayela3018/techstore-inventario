const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'techstore',
  password: process.env.DB_PASSWORD || 'techstore123',
  database: process.env.DB_NAME || 'techstore_db',
});

// Crear tablas automáticamente
const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) UNIQUE NOT NULL,
        descripcion TEXT,
        fecha_creacion TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tiendas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        ciudad VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre_completo VARCHAR(100) NOT NULL,
        tienda_id INTEGER REFERENCES tiendas(id),
        mfa_habilitado BOOLEAN DEFAULT false,
        mfa_secret VARCHAR(255),
        mfa_code VARCHAR(6),
        mfa_code_expiry TIMESTAMP,
        intentos_fallidos INTEGER DEFAULT 0,
        bloqueado BOOLEAN DEFAULT false,
        activo BOOLEAN DEFAULT true,
        mfa_intentos INTEGER DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS usuario_roles (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        rol_id INTEGER REFERENCES roles(id),
        asignado_por INTEGER REFERENCES usuarios(id),
        fecha_asignacion TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        categoria VARCHAR(50),
        tienda_id INTEGER REFERENCES tiendas(id),
        es_premium BOOLEAN DEFAULT false,
        creado_por INTEGER REFERENCES usuarios(id),
        fecha_creacion TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP DEFAULT NOW()
      );
    `);

    // Insertar datos iniciales
    await client.query(`
      INSERT INTO tiendas (nombre, ciudad) VALUES
        ('TechStore Lima', 'Lima'),
        ('TechStore Arequipa', 'Arequipa')
      ON CONFLICT DO NOTHING;

      INSERT INTO roles (nombre, descripcion) VALUES
        ('Admin', 'Acceso total al sistema'),
        ('Gerente', 'Gestiona productos de su tienda'),
        ('Empleado', 'Consulta y actualiza stock'),
        ('Auditor', 'Solo lectura y reportes')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (err) {
    console.error('❌ Error inicializando DB:', err.message);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };