import { useNavigate } from 'react-router-dom';

function normalizarUsuario(usuario) {
  if (!usuario) {
    return null;
  }

  if (typeof usuario === 'string') {
    return {
      email: usuario,
      nombre: usuario.includes('@') ? usuario.split('@')[0] : usuario,
    };
  }

  return usuario;
}

export default function Perfil({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const usuarioActual = normalizarUsuario(usuario || JSON.parse(localStorage.getItem('usuarioActivo') || 'null'));

  const cerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('usuarioActivo');
      setUsuario(null);
      navigate('/');
    }
  };

  if (!usuarioActual) {
    return (
      <main className="container py-5 page-shell text-center text-white">
        <div className="card bg-dark border-secondary border-opacity-25 p-4 mx-auto shadow" style={{ maxWidth: '480px' }}>
          <h2 className="fw-bold mb-3 text-white">Accede a tu cuenta</h2>
          <p className="text-muted mb-4 small">Debes iniciar sesión para ver tu perfil de usuario.</p>
          <button className="btn btn-warning text-dark fw-bold w-100" onClick={() => navigate('/login')}>Ir al login</button>
        </div>
      </main>
    );
  }

  const fechaRegistro = usuarioActual.fechaRegistro
    ? new Date(usuarioActual.fechaRegistro).toLocaleDateString('es-ES')
    : 'Registro local';

  return (
    <main className="container py-5 page-shell text-white">
      <div className="text-center mb-4">
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold small text-uppercase">Mi cuenta</span>
        <h2 className="fw-bold mt-3 mb-0 text-white">Mi Perfil</h2>
      </div>
      
      <div className="card bg-dark text-white p-4 border-secondary border-opacity-25 mx-auto shadow rounded-4" style={{ maxWidth: '640px' }}>
        <div className="text-center mb-4">
          <img 
            src={new URL('../img/unnamed.png', import.meta.url).href} 
            alt="Avatar Usuario" 
            className="rounded-circle border border-warning border-3 shadow-sm" 
            style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
            onError={(e) => { 
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioActual.nombre || 'Usuario')}&background=1a1a1a&color=ffc107&size=120`; 
            }} 
          />
        </div>
        
        <div id="perfilContent">
          <div className="mb-4 text-center border-bottom border-secondary border-opacity-10 pb-3">
            <h3 className="fw-bold text-white fs-5 mb-1">Información personal</h3>
            <p className="text-muted small mb-0">¡Qué bueno verte de nuevo, {usuarioActual.nombre || usuarioActual.email.split('@')[0]}!</p>
          </div>

          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted d-block mb-1">Nombre Completo</label>
            <p className="fw-bold text-white fs-6 bg-black bg-opacity-40 p-2 rounded border border-secondary border-opacity-10 mb-0">
              {usuarioActual.nombre || 'Usuario'}
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted d-block mb-1">Correo electrónico</label>
            <p className="fw-bold text-white fs-6 bg-black bg-opacity-40 p-2 rounded border border-secondary border-opacity-10 mb-0">
              {usuarioActual.email}
            </p>
          </div>

          <div className="mb-4">
            <label className="form-label small text-uppercase text-muted d-block mb-1">Miembro desde</label>
            <p className="fw-bold text-white fs-6 bg-black bg-opacity-40 p-2 rounded border border-secondary border-opacity-10 mb-0">
              {fechaRegistro}
            </p>
          </div>

          <div className="d-flex flex-column gap-2 mt-4">
            <button className="btn btn-outline-light w-100 py-2 fw-medium" type="button">Editar perfil</button>
            <button className="btn btn-outline-danger w-100 py-2 fw-medium" onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </main>
  );
}