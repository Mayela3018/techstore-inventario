const express = require('express');
const router = express.Router();
const { getProductos, createProducto, updateProducto, deleteProducto } = require('../controllers/productos.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getProductos);
router.post('/', verifyToken, createProducto);
router.put('/:id', verifyToken, updateProducto);
router.delete('/:id', verifyToken, deleteProducto);

module.exports = router;