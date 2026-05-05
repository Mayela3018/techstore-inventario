import { useState } from 'react';
import api from '../api';

export function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | mfa | register | showQR
  const [form, setForm] = useState({ email: '', password: '', nombre_completo: '', tienda_id: '1' });
  const [mfaCode, setMfaCode] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      if (data.mfa_required) {
        setUsuarioId(data.usuario_id);
        setMode('mfa');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  const handleMFA = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/verify-mfa', {
        usuario_id: usuarioId,
        code: mfaCode
      });
      onLogin(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Código inválido');
      setMfaCode('');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      setQrCode(data.qr_code);
      setMfaSecret(data.mfa_secret);
      setMode('showQR');
    } catch (e) {
      setError(e.response?.data?.error || 'Error al registrar');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: mode === 'showQR' ? 480 : 420 }}>

        <h1>🛍️ TechStore</h1>
        <p>Sistema de Gestión de Inventario</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* LOGIN */}
        {mode === 'login' && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="admin@techstore.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
              onClick={handleLogin} disabled={loading}>
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: 13 }}>
              ¿No tienes cuenta?{' '}
              <span style={{ color: '#38bdf8', cursor: 'pointer' }}
                onClick={() => { setMode('register'); setError(''); }}>
                Regístrate
              </span>
            </p>
          </>
        )}

        {/* MFA */}
        {mode === 'mfa' && (
          <>
            <div className="alert alert-success">
              ✅ Credenciales correctas. Abre <strong>Google Authenticator</strong> e ingresa el código de 6 dígitos.
            </div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>📱</div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
                El código cambia cada 30 segundos
              </p>
            </div>
            <div className="form-group">
              <label>Código Google Authenticator (6 dígitos)</label>
              <input type="text" placeholder="123456" maxLength={6}
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleMFA()}
                style={{ fontSize: 24, textAlign: 'center', letterSpacing: 8 }} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
              onClick={handleMFA} disabled={loading || mfaCode.length !== 6}>
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 12, color: '#94a3b8', fontSize: 13 }}>
              <span style={{ color: '#38bdf8', cursor: 'pointer' }}
                onClick={() => { setMode('login'); setError(''); setMfaCode(''); }}>
                ← Volver al login
              </span>
            </p>
          </>
        )}

        {/* REGISTRO */}
        {mode === 'register' && (
          <>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" placeholder="Juan Pérez"
                value={form.nombre_completo}
                onChange={e => setForm({ ...form, nombre_completo: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="juan@techstore.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Min. 8 chars, mayúscula, número, especial"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tienda</label>
              <select value={form.tienda_id}
                onChange={e => setForm({ ...form, tienda_id: e.target.value })}>
                <option value="1">TechStore Lima</option>
                <option value="2">TechStore Arequipa</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
              onClick={handleRegister} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: 13 }}>
              ¿Ya tienes cuenta?{' '}
              <span style={{ color: '#38bdf8', cursor: 'pointer' }}
                onClick={() => { setMode('login'); setError(''); }}>
                Inicia sesión
              </span>
            </p>
          </>
        )}

        {/* MOSTRAR QR */}
        {mode === 'showQR' && (
          <>
            <div className="alert alert-success">
              ✅ ¡Registro exitoso! Escanea este QR con Google Authenticator.
            </div>
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <img src={qrCode} alt="QR Google Authenticator"
                style={{ width: 200, height: 200, borderRadius: 8, background: 'white', padding: 8 }} />
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                Si no puedes escanear, ingresa este código manualmente:
              </p>
              <p style={{ color: '#38bdf8', fontSize: 13, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {mfaSecret}
              </p>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
              📱 Abre Google Authenticator → Agregar cuenta → Escanear QR
            </p>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
              onClick={() => { setMode('login'); setError(''); }}>
              Ya escaneé el QR → Ir al Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}