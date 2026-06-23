import { Link, useLocation } from 'react-router-dom';

export default function Header({ usuario, carrito }) {
  const location = useLocation();
  const cantidadCarrito = (carrito || []).reduce((total, item) => total + (item.cantidad || 1), 0);
  const rutaUsuario = usuario ? '/perfil' : '/login';
  const textoUsuario = usuario ? 'Perfil' : 'Login';

  const linkClass = (path) => `nav-link px-3 py-2 fw-medium ${location.pathname === path ? 'text-warning' : 'text-lightOpacity'}`;

  return (
    <header className="navbar navbar-expand-lg bg-black border-bottom border-secondary border-opacity-10 py-3">
      <div className="container">
        
        {/* LOGO */}
        <Link to="/" className="navbar-brand fw-bold text-white d-flex align-items-center gap-2 m-0 fs-4">
          <span className="soft-badge bg-warning text-dark px-2 py-1 rounded fs-6 fw-black">M</span>
          Mestrax
        </Link>

        {/* BOTÓN HAMBURGUESA PARA CELULARES */}
        <button 
          className="navbar-toggler border-secondary text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* ENLACES DE NAVEGACIÓN */}
        <div className="collapse navbar-collapse justify-content-end mt-3 mt-lg-0" id="navbarNav">
          <nav className="navbar-nav gap-1 text-center text-lg-start">
            <Link to="/" className={linkClass('/')}>Inicio</Link>
            <Link to="/productos" className={linkClass('/productos')}>Productos</Link>
            <Link to="/reserva" className={linkClass('/reserva')}>Reserva</Link>
            
            <Link to="/carrito" className={linkClass('/carrito')}>
              Carrito <span className="badge bg-warning text-dark ms-1 px-2 rounded-pill">{cantidadCarrito}</span>
            </Link>
            
            <Link to="/contactos" className={linkClass('/contactos')}>Contacto</Link>
            <Link to={rutaUsuario} className={`${linkClass(rutaUsuario)} btn-user-highlight`}>{textoUsuario}</Link>
            <Link to="/login-admin" className="nav-link px-3 py-2 text-muted small hover-warning">Admin</Link>
          </nav>
        </div>

      </div>
    </header>
  );
}