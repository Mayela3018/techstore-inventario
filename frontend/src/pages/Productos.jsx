import { useState, useEffect } from 'react';
import api from '../api';

export function Productos({ user }) {
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '',
    stock: '', categoria: '', tienda_id: '1', es_premium: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const rol = user.rol;

  const load = async () => {
    try {
      const { data } = await api.get('/productos');
      setProductos(data);
    } catch (e) {
      setError('Error cargando productos');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setError('');
    try {
      await api.post('/productos', form);
      setSuccess('Producto creado exitosamente');
      setModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear producto');
    }
  };

  const handleUpdate = async () => {
    setError('');
    try {
      await api.put(`/productos/${selected.id}`, form);
      setSuccess('Producto actualizado');
      setEditModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      setSuccess('Producto eliminado');
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Sin permiso para eliminar');
    }
  };

  const openEdit = (p) => {
    setSelected(p);
    setForm({
      nombre: p.nombre, descripcion: p.descripcion,
      precio: p.precio, stock: p.stock,
      categoria: p.categoria, tienda_id: p.tienda_id,
      es_premium: p.es_premium
    });
    setEditModal(true);
  };

  const canCreate = ['Admin', 'Gerente', 'Empleado'].includes(rol);
  const canDelete = ['Admin', 'Gerente'].includes(rol);

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-container">
        <div className="table-header">
          <h3>Inventario de Productos</h3>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => setModal(true)}>
              + Nuevo Producto
            </button>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Precio</th><th>Stock</th>
              <th>Categoría</th><th>Tienda</th><th>Tipo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>S/ {parseFloat(p.precio).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.categoria}</td>
                <td>#{p.tienda_id}</td>
                <td>
                  <span className={`tag ${p.es_premium ? 'tag-premium' : 'tag-normal'}`}>
                    {p.es_premium ? '⭐ Premium' : 'Normal'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-warning btn-sm" onClick={() => openEdit(p)}>
                    Editar
                  </button>
                  {canDelete && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>📦 Nuevo Producto</h3>
            {[
              ['nombre', 'Nombre', 'text'],
              ['descripcion', 'Descripción', 'text'],
              ['precio', 'Precio', 'number'],
              ['stock', 'Stock', 'number'],
              ['categoria', 'Categoría', 'text'],
            ].map(([k, l, t]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input
                  type={t}
                  value={form[k]}
                  onChange={e => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
            <div className="form-group">
              <label>Tienda</label>
              <select
                value={form.tienda_id}
                onChange={e => setForm({ ...form, tienda_id: e.target.value })}
              >
                <option value="1">TechStore Lima</option>
                <option value="2">TechStore Arequipa</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.es_premium}
                  onChange={e => setForm({ ...form, es_premium: e.target.checked })}
                />
                {' '}Producto Premium ⭐
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setModal(false)}
                style={{ background: '#334155', color: '#e2e8f0' }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✏️ Editar Producto</h3>
            {rol === 'Empleado' ? (
              <div className="form-group">
                <label>Stock (solo puedes modificar el stock)</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            ) : (
              [
                ['nombre', 'Nombre', 'text'],
                ['descripcion', 'Descripción', 'text'],
                ['precio', 'Precio', 'number'],
                ['stock', 'Stock', 'number'],
              ].map(([k, l, t]) => (
                <div className="form-group" key={k}>
                  <label>{l}</label>
                  <input
                    type={t}
                    value={form[k]}
                    onChange={e => setForm({ ...form, [k]: e.target.value })}
                  />
                </div>
              ))
            )}
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setEditModal(false)}
                style={{ background: '#334155', color: '#e2e8f0' }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}