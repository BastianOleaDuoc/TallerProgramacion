import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-modern mt-auto bg-black border-top border-secondary border-opacity-10 py-3">
      <div className="container text-center text-md-start">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0 text-muted small">
            Reserva tu mesa y disfruta la noche. © 2026 Mestrax
          </p>
          <div className="d-flex gap-3 text-muted small">
            <Link to="/" className="text-muted text-decoration-none hover-warning">Inicio</Link>
            <Link to="/productos" className="text-muted text-decoration-none hover-warning">Carta</Link>
            <Link to="/reserva" className="text-muted text-decoration-none hover-warning">Reservas</Link>
            <Link to="/contactos" className="text-muted text-decoration-none hover-warning">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}