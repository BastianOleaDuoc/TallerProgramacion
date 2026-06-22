import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../data/productos';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.message || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('adminActivo', data.email || email);
      navigate('/admin');
    } catch (submitError) {
      console.error(submitError);
      setError('No se pudo conectar con el backend. Revisa que este ejecutandose.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container auth-layout page-shell">
      <section className="auth-panel">
        <div className="card auth-card border-0">
          <div className="text-center mb-3">
            <span className="soft-badge">Acceso exclusivo</span>
          </div>
          <h2 className="text-center fw-bold mb-4">Panel Administrativo</h2>
          <form id="adminForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo corporativo</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="admin@mestrax.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contrasena</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-danger small mb-3">{error}</p>}
            <button type="submit" className="btn btn-dark w-100 mt-3 auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0 text-light">Solo personal autorizado</p>
        </div>
      </section>
    </main>
  );
}
