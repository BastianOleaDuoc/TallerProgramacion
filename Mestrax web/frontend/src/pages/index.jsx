import { Link } from 'react-router-dom';

export default function IndexPage() { 
  return (
    <>
      {/* Hero Section */}
      <section className="hero-modern container text-center py-5 mt-4 text-white">
        <div className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold small text-uppercase tracking-wider">
          ✨ Nueva Experiencia Digital
        </div>
        <h1 className="display-3 fw-black mb-4 text-white">
          El futuro de la <br/>
          <span className="text-warning">Alta Gastronomía</span>
        </h1>
        <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
          Disfruta de una selección exclusiva de hamburguesas de autor, mixología premium y un ambiente inigualable. Todo a un clic de distancia.
        </p>
        
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/productos" className="btn btn-warning btn-lg px-4 fw-bold text-dark shadow-sm">
            Ver menú completo
          </Link>
          <Link to="/reserva" className="btn btn-outline-light btn-lg px-4 fw-medium">
            Reservar mesa
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container my-5 py-5 border-top border-secondary border-opacity-10 text-white">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 h-100 shadow-sm">
              <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-star-fill text-warning fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3 text-white fs-5">Calidad Premium</h4>
              <p className="text-muted small m-0">Ingredientes frescos y seleccionados para brindarte una explosión de sabor.</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 h-100 shadow-sm">
              <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-lightning-charge-fill text-info fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3 text-white fs-5">Servicio Rápido</h4>
              <p className="text-muted small m-0">Optimizado para que tu pedido llegue caliente y en tiempo récord.</p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 h-100 shadow-sm">
              <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-calendar2-check-fill text-danger fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3 text-white fs-5">Reservas Inteligentes</h4>
              <p className="text-muted small m-0">Elige tu mesa ideal de forma rápida directamente desde la web.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}