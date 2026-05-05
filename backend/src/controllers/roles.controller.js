const { pool } = require('../db');

const getRoles = async (req, res) => {
  const result = await pool.query('SELECT * FROM roles ORDER BY id');
  res.json(result.rows);
};

const createRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRol = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE roles SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRol = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si tiene usuarios asignados
    const check = await pool.query('SELECT COUNT(*) FROM usuario_roles WHERE rol_id = $1', [id]);
    if (parseInt(check.rows[0].count) > 0) {
      return res.status(400).json({ error: 'No se puede eliminar un rol con usuarios asignados' });
    }
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    res.json({ message: 'Rol eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getRoles, createRol, updateRol, deleteRol };