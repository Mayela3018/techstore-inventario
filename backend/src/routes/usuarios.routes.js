const express = require('express');
const router = express.Router();
const { getUsuarios, asignarRol } = require('../controllers/usuarios.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

router.get('/', verifyToken, checkRole('Admin'), getUsuarios);
router.post('/asignar-rol', verifyToken, checkRole('Admin'), asignarRol);

module.exports = router;