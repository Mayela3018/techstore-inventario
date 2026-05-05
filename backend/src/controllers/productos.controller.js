const { pool } = require('../db');
const { checkProductPolicy } = require('../utils/policy-engine');

const getProductos = async (req, res) => {
  const { rol, tienda_id } = req.user;
  let query = 'SELECT * FROM productos';
  let params = [];

  if (rol === 'Gerente' || rol === 'Empleado') {
    query += ' WHERE tienda_id = $1';
    params = [tienda_id];
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
};

const createProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, tienda_id, es_premium } = req.body;
  const { rol, tienda_id: userTienda, id } = req.user;

  const allowed = checkProductPolicy('INSERT', rol, userTienda, { tienda_id, es_premium });
  if (!allowed) return res.status(403).json({ error: 'No tienes permiso para crear este producto' });

  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, tienda_id, es_premium, creado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nombre, descripcion, precio, stock, categoria, tienda_id, es_premium, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { rol, tienda_id: userTienda } = req.user;

  const prod = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });

  const allowed = checkProductPolicy('UPDATE', rol, userTienda, prod.rows[0]);
  if (!allowed) return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });

  // Empleado solo puede actualizar stock
  let updates = req.body;
  if (rol === 'Empleado') updates = { stock: req.body.stock };
  // Gerente no puede cambiar categoría
  if (rol === 'Gerente') delete updates.categoria;

  const fields = Object.keys(updates).map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = [...Object.values(updates), id];

  try {
    const result = await pool.query(
      `UPDATE productos SET ${fields}, fecha_actualizacion = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const { rol, tienda_id: userTienda } = req.user;

  const prod = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });

  const allowed = checkProductPolicy('DELETE', rol, userTienda, prod.rows[0]);
  if (!allowed) return res.status(403).json({ error: 'Empleados no pueden eliminar productos' });

  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  res.json({ message: 'Producto eliminado' });
};

module.exports = { getProductos, createProducto, updateProducto, deleteProducto };