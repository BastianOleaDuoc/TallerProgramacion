import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUsuario }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      alert('Completa todos los campos');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuariosMestrax') || '[]');
    const usuario = usuarios.find((item) => item.email === form.email.trim() && item.password === form.password);

    if (!usuario) {
      alert('Correo o contraseña incorrectos');
      return;
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    setUsuario(usuario);
    navigate('/perfil');
  };

  return (
    <main className="container auth-layout page-shell">
      <section className="auth-panel">
        <div className="card auth-card border-0">
          <div className="text-center mb-3">
            <span className="soft-badge">Acceso rápido</span>
          </div>
          <h2 className="text-center fw-bold mb-4">Acceso Mestrax</h2>
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input type="email" id="email" name="email" className="form-control" placeholder="correo@gmail.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-dark w-100 mt-3 auth-submit-btn">Ingresar</button>
          </form>
          <p className="text-center mt-3 text-light mb-2">
            ¿No tienes cuenta? <Link to="/registro" className="fw-bold text-warning text-decoration-none">Regístrate</Link>
          </p>
          <p className="text-center mb-0 text-light">
            <Link to="/login-admin" className="text-info text-decoration-none">Ingresar como administrador</Link>
          </p>
        </div>
      </section>
    </main>
  );
}