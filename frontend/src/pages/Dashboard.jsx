import { useState } from 'react';
import { Roles } from './Roles';
import { Usuarios } from './Usuarios';
import { Productos } from './Productos';

export function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', roles: ['Admin','Gerente','Empleado','Auditor'] },
    { id: 'productos', label: '📦 Productos', roles: ['Admin','Gerente','Empleado','Auditor'] },
    { id: 'roles', label: '🛡️ Roles', roles: ['Admin'] },
    { id: 'usuarios', label: '👥 Usuarios', roles: ['Admin'] },
  ];

  const badgeClass = user.rol?.toLowerCase() || 'empleado';

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🛍️ TechStore</h2>
          <span>Gestión de Inventario</span>
        </div>
        <nav className="sidebar-nav">
          {navItems
            .filter(item => !user.rol || item.roles.includes(user.rol))
            .map(item => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                {item.label}
              </button>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <div style={{ padding: '0 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.email}</div>
            <span className={`badge ${badgeClass}`}>{user.rol}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <h1>{navItems.find(n => n.id === page)?.label}</h1>
          <span className={`badge ${badgeClass}`}>{user.rol}</span>
        </div>
        <div className="content">
          {page === 'dashboard' && <DashHome rol={user.rol} />}
          {page === 'productos' && <Productos user={user} />}
          {page === 'roles' && <Roles />}
          {page === 'usuarios' && <Usuarios />}
        </div>
      </main>
    </div>
  );
}

function DashHome({ rol }) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Tu Rol</div>
          <div className="value" style={{ fontSize: 24 }}>{rol}</div>
        </div>
        <div className="stat-card">
          <div className="label">Sistema</div>
          <div className="value" style={{ fontSize: 24 }}>✅ Activo</div>
        </div>
        <div className="stat-card">
          <div className="label">Seguridad</div>
          <div className="value" style={{ fontSize: 24 }}>🔐 JWT</div>
        </div>
        <div className="stat-card">
          <div className="label">MFA</div>
          <div className="value" style={{ fontSize: 24 }}>📱 TOTP</div>
        </div>
      </div>

      <div className="table-container" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16, color: '#38bdf8' }}>
          🔐 Controles de Seguridad Implementados
        </h3>
        <table>
          <thead>
            <tr><th>Control</th><th>Descripción</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {[
              ['JWT Auth', 'Tokens seguros con expiración de 8h', '✅'],
              ['MFA', 'TOTP + Código por email', '✅'],
              ['Bloqueo', 'Cuenta bloqueada tras 5 intentos fallidos', '✅'],
              ['RBAC', 'Control de acceso basado en roles', '✅'],
              ['ABAC', 'Control por atributos (tienda, premium)', '✅'],
              ['Password Hash', 'bcrypt con salt rounds 10', '✅'],
              ['Docker', 'Contenedores aislados', '✅'],
            ].map(([ctrl, desc, est]) => (
              <tr key={ctrl}>
                <td><strong>{ctrl}</strong></td>
                <td>{desc}</td>
                <td>{est}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}