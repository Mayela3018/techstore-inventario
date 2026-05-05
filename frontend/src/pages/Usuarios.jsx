import { useState, useEffect } from 'react';
import api from '../api';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ usuario_id: '', rol_id: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [u, r] = await Promise.all([
      api.get('/usuarios'),
      api.get('/roles')
    ]);
    setUsuarios(u.data);
    setRoles(r.data);
  };

  useEffect(() => { load(); }, []);

  const handleAsignar = async () => {
    try {
      await api.post('/usuarios/asignar-rol', form);
      setSuccess('Rol asignado correctamente');
      setModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Error al asignar rol');
    }
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-container">
        <div className="table-header">
          <h3>Usuarios del Sistema</h3>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            + Asignar Rol
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Email</th><th>Nombre</th>
              <th>Tienda</th><th>Roles</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.nombre_completo}</td>
                <td>Tienda #{u.tienda_id}</td>
                <td>{u.roles?.filter(Boolean).join(', ') || '—'}</td>
                <td>
                  <span style={{ color: u.activo ? '#22c55e' : '#ef4444' }}>
                    {u.activo ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>👤 Asignar Rol a Usuario</h3>
            <div className="form-group">
              <label>Usuario</label>
              <select
                value={form.usuario_id}
                onChange={e => setForm({ ...form, usuario_id: e.target.value })}
              >
                <option value="">Seleccionar usuario...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select
                value={form.rol_id}
                onChange={e => setForm({ ...form, rol_id: e.target.value })}
              >
                <option value="">Seleccionar rol...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setModal(false)}
                style={{ background: '#334155', color: '#e2e8f0' }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleAsignar}>
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}