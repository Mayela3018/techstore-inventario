const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { generateTOTPSecret, verifyTOTP, generateQR } = require('../utils/mfa.utils');

// REGISTRO
const register = async (req, res) => {
  const { email, password, nombre_completo, tienda_id } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    
    // Generar secret TOTP automáticamente al registrarse
    const mfaSecret = generateTOTPSecret();
    
    const result = await pool.query(
      `INSERT INTO usuarios (email, password, nombre_completo, tienda_id, mfa_secret, mfa_habilitado)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING id, email, nombre_completo`,
      [email, hash, nombre_completo, tienda_id, mfaSecret]
    );

    // Generar QR para Google Authenticator
    const qrCode = await generateQR(email, mfaSecret);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: result.rows[0],
      mfa_secret: mfaSecret,
      qr_code: qrCode,
      instruccion: 'Escanea el QR con Google Authenticator antes de iniciar sesión'
    });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'El email ya está registrado' });
    res.status(500).json({ error: err.message });
  }
};

// LOGIN - Paso 1: verificar credenciales
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (user.bloqueado) return res.status(403).json({ error: 'Cuenta bloqueada por múltiples intentos fallidos' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const intentos = user.intentos_fallidos + 1;
      await pool.query(
        'UPDATE usuarios SET intentos_fallidos = $1, bloqueado = $2 WHERE id = $3',
        [intentos, intentos >= 5, user.id]
      );
      return res.status(401).json({ 
        error: `Credenciales inválidas. Intentos fallidos: ${intentos}/5` 
      });
    }

    // Resetear intentos fallidos
    await pool.query('UPDATE usuarios SET intentos_fallidos = 0 WHERE id = $1', [user.id]);

    // Siempre pedir MFA
    return res.json({
      mfa_required: true,
      usuario_id: user.id,
      message: 'Credenciales correctas. Ingresa el código de Google Authenticator.'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN - Paso 2: verificar código TOTP
const verifyMFA = async (req, res) => {
  const { usuario_id, code } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar intentos MFA
    const mfaIntentos = user.mfa_intentos || 0;
    if (mfaIntentos >= 3) {
      return res.status(403).json({ error: 'Máximo de intentos MFA alcanzado. Vuelve a iniciar sesión.' });
    }

    // Verificar código TOTP
    const isValid = verifyTOTP(code, user.mfa_secret);
    
    if (!isValid) {
      await pool.query(
        'UPDATE usuarios SET mfa_intentos = $1 WHERE id = $2',
        [mfaIntentos + 1, user.id]
      );
      return res.status(401).json({ 
        error: `Código inválido. Intentos: ${mfaIntentos + 1}/3` 
      });
    }

    // Resetear intentos MFA
    await pool.query('UPDATE usuarios SET mfa_intentos = 0 WHERE id = $1', [user.id]);

    // Obtener rol
    const rolResult = await pool.query(
      `SELECT r.nombre FROM roles r
       JOIN usuario_roles ur ON r.id = ur.rol_id
       WHERE ur.usuario_id = $1 LIMIT 1`,
      [user.id]
    );
    const rol = rolResult.rows[0]?.nombre || 'Sin rol';

    const token = jwt.sign(
      { id: user.id, email: user.email, rol, tienda_id: user.tienda_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      rol, 
      email: user.email,
      message: '✅ Acceso concedido'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OBTENER QR para usuario ya registrado
const getQR = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT email, mfa_secret FROM usuarios WHERE id = $1', [userId]);
    const user = result.rows[0];
    const qr = await generateQR(user.email, user.mfa_secret);
    res.json({ qr_code: qr, mfa_secret: user.mfa_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, verifyMFA, getQR };