// Motor de políticas ABAC
const checkProductPolicy = (action, userRole, userTiendaId, product) => {
  switch (action) {
    case 'SELECT':
      if (userRole === 'Admin' || userRole === 'Auditor') return true;
      if (userRole === 'Gerente' || userRole === 'Empleado')
        return product.tienda_id === userTiendaId;
      return false;

    case 'INSERT':
      if (userRole === 'Admin') return true;
      if (userRole === 'Gerente') return product.tienda_id === userTiendaId;
      if (userRole === 'Empleado')
        return product.tienda_id === userTiendaId && !product.es_premium;
      return false;

    case 'UPDATE':
      if (userRole === 'Admin') return true;
      if (userRole === 'Gerente') return product.tienda_id === userTiendaId;
      if (userRole === 'Empleado')
        return product.tienda_id === userTiendaId;
      return false;

    case 'DELETE':
      if (userRole === 'Admin') return true;
      if (userRole === 'Gerente')
        return product.tienda_id === userTiendaId && !product.es_premium;
      return false;

    default:
      return false;
  }
};

module.exports = { checkProductPolicy };