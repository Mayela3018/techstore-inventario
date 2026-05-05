const { pool } = require('../db');

const getUsuarios = async (req, res) => {
  const result = await pool.query(
    `SELECT u.id, u.email, u.nombre_completo, u.tienda_id, u.activo,
            array_agg(r.nombre) as roles
     FROM usuarios u
     LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
     LEFT JOIN roles r ON ur.rol_id = r.id
     GROUP BY u.id`
  );
  res.json(result.rows);
};

const asignarRol = async (req, res) => {
  const { usuario_id, rol_id } = req.body;
  const asignado_por = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO usuario_roles (usuario_id, rol_id, asignado_por)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING *`,
      [usuario_id, rol_id, asignado_por]
    );
    res.status(201).json({ message: 'Rol asignado', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsuarios, asignarRol };