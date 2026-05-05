const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRole = req.user?.rol;
    if (!rolesPermitidos.includes(userRole)) {
      return res.status(403).json({
        error: `Acceso denegado. No tienes permisos de ${rolesPermitidos.join(' o ')}`
      });
    }
    next();
  };
};

module.exports = { checkRole };