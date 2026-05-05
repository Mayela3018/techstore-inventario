import { useState, useEffect } from 'react';
import api from '../api';

export function Roles() {
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const { data } = await api.get('/roles');
    setRoles(data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/roles', form);
      setSuccess('Rol creado exitosamente');
      setModal(false);
      setForm({ nombre: '', descripcion: '' });
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear rol');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este rol?')) return;
    try {
      await api.delete(`/roles/${id}`);
      setSuccess('Rol eliminado');
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-container">
        <div className="table-header">
          <h3>Roles del Sistema</h3>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            + Nuevo Rol
          </button>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  <span className={`badge ${r.nombre.toLowerCase()}`}>{r.nombre}</span>
                </td>
                <td>{r.descripcion}</td>
                <td>{new Date(r.fecha_creacion).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>➕ Crear Nuevo Rol</h3>
            <div className="form-group">
              <label>Nombre del Rol</label>
              <input
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Supervisor"
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción del rol"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setModal(false)}
                style={{ background: '#334155', color: '#e2e8f0' }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                Crear Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}