const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/roles', require('./routes/roles.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/productos', require('./routes/productos.routes'));

app.get('/', (req, res) => res.json({ message: '🚀 TechStore API corriendo!' }));

const PORT = process.env.PORT || 3000;

// Esperar a que PostgreSQL esté listo
const waitForDB = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`⏳ Intentando conectar a la DB... (intento ${i}/${retries})`);
      await initDB();
      return true;
    } catch (err) {
      console.log(`❌ DB no lista aún: ${err.message}`);
      if (i < retries) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  return false;
};

const start = async () => {
  const connected = await waitForDB();
  if (!connected) {
    console.error('❌ No se pudo conectar a la DB después de varios intentos');
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));
};

start();