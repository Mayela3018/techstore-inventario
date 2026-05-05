const express = require('express');
const router = express.Router();
const { getRoles, createRol, updateRol, deleteRol } = require('../controllers/roles.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/rbac.middleware');

router.get('/', verifyToken, getRoles);
router.post('/', verifyToken, checkRole('Admin'), createRol);
router.put('/:id', verifyToken, checkRole('Admin'), updateRol);
router.delete('/:id', verifyToken, checkRole('Admin'), deleteRol);

module.exports = router;