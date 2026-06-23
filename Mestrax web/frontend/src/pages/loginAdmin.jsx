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
      setError('No se pudo conectar con el backend. Revisa que tu servidor Java esté ejecutándose.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container auth-layout page-shell py-5 text-white">
      <section className="auth-panel mx-auto" style={{ maxWidth: '450px' }}>
        <div className="card bg-dark text-white p-4 rounded-4 shadow border border-secondary border-opacity-25">
          <div className="text-center mb-2">
            <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill fw-bold small text-uppercase">
              Acceso exclusivo
            </span>
          </div>
          <h2 className="text-center fw-bold mb-4 text-white">Panel Administrativo</h2>
          
          <form id="adminForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-uppercase text-muted">Correo corporativo</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control bg-black text-white border-secondary"
                placeholder="admin@mestrax.com"
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-uppercase text-muted">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control bg-black text-white border-secondary"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            
            {error && (
              <div className="alert alert-danger py-2 border-0 bg-danger bg-opacity-10 text-danger small mb-3">
                ⚠️ {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-warning text-dark w-100 fw-bold py-2 mt-3 shadow-sm" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar al Panel'}
            </button>
          </form>
          
          <p className="text-center small text-muted mt-4 mb-0">Solo personal autorizado de Mestrax</p>
        </div>
      </section>
    </main>
  );
}