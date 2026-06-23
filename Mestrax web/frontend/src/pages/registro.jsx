import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro({ setUsuario }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { nombre, email, password, confirmPassword } = form;

    if (!nombre.trim() || !email.trim() || !password || !confirmPassword) {
      alert('Completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuariosMestrax') || '[]');
    if (usuarios.find((item) => item.email === email.trim())) {
      alert('El correo electrónico ya está registrado');
      return;
    }

    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      fechaRegistro: new Date().toISOString(),
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuariosMestrax', JSON.stringify(usuarios));
    localStorage.setItem('usuarioActivo', JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    navigate('/perfil');
  };

  return (
    <main className="container auth-layout page-shell py-5 text-white">
      <section className="auth-panel mx-auto" style={{ maxWidth: '480px' }}>
        <div className="card bg-dark text-white p-4 rounded-4 shadow border border-secondary border-opacity-25">
          <div className="text-center mb-2">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold small text-uppercase">
              Únete a la experiencia
            </span>
          </div>
          <h2 className="text-center fw-bold mb-4 text-white">Crear Cuenta Mestrax</h2>
          
          <form id="registroForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-uppercase text-muted">Nombre completo</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                className="form-control bg-black text-white border-secondary" 
                placeholder="Tu nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-uppercase text-muted">Correo electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control bg-black text-white border-secondary" 
                placeholder="correo@gmail.com" 
                value={form.email} 
                onChange={handleChange} 
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
                placeholder="••••••••" 
                value={form.password} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-uppercase text-muted">Confirmar contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                className="form-control bg-black text-white border-secondary" 
                placeholder="••••••••" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                required
              />
            </div>
            <button type="submit" className="btn btn-warning text-dark w-100 fw-bold py-2 mt-3 shadow-sm">
              Registrarse
            </button>
          </form>
          
          <hr className="border-secondary border-opacity-25 my-4" />

          <p className="text-center small text-muted mb-0">
            ¿Ya tienes cuenta? <Link to="/login" className="fw-bold text-warning text-decoration-none hover-underline">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}