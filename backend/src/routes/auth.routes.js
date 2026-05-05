const express = require('express');
const router = express.Router();
const { register, login, verifyMFA, getQR } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-mfa', verifyMFA);
router.get('/qr', verifyToken, getQR);

module.exports = router;