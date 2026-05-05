const { authenticator } = require('otplib');
const QRCode = require('qrcode');

// Generar secret para TOTP
const generateTOTPSecret = () => {
  return authenticator.generateSecret();
};

// Verificar código TOTP
const verifyTOTP = (token, secret) => {
  return authenticator.verify({ token, secret });
};

// Generar QR para Google Authenticator
const generateQR = async (email, secret) => {
  const otpauth = authenticator.keyuri(email, 'TechStore', secret);
  return await QRCode.toDataURL(otpauth);
};

// Generar código de 6 dígitos para email
const generateEmailCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateTOTPSecret, verifyTOTP, generateQR, generateEmailCode };