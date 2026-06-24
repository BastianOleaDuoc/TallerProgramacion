import { Link } from 'react-router-dom';

const HOME_IMAGES = {
  mycelium: new URL('../img/mycelium.jpg', import.meta.url).href,
  cosmo: new URL('../img/cosmo.png', import.meta.url).href,
  rustica: new URL('../img/rustica.png', import.meta.url).href,
  brownie: new URL('../img/brownie.png', import.meta.url).href,
  fallback: new URL('../img/unnamed.png', import.meta.url).href,
};

export default function Home() {
  return (
    <main className="container py-5 page-shell text-white">
      {/* Hero Section */}
      <section className="row align-items-center hero-modern mb-5 pt-4">
        <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
          <div className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold small text-uppercase tracking-wider">
            La mejor experiencia gastronómica
          </div>
          <h1 className="display-4 fw-black mb-3 text-white">
            Bienvenido a <span className="text-warning">Mestrax</span>
          </h1>
          <p className="lead text-muted mx-auto mx-lg-0 mb-4" style={{ maxWidth: '600px' }}>
            Descubre nuestra fusión única de sabores, hamburguesas de autor y mixología en un ambiente inigualable. Todo acompañado de los mejores juegos de mesa para disfrutar la noche.
          </p>
          <div className="d-flex justify-content-center justify-content-lg-start gap-3">
            <Link to="/reserva" className="btn btn-warning text-dark px-4 py-2 fw-bold shadow-sm">
              Reservar Mesa
            </Link>
            <Link to="/productos" className="btn btn-outline-light px-4 py-2 fw-medium">
              Ver Menú
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="position-relative overflow-hidden rounded-4 shadow-lg border border-secondary border-opacity-25">
            <img 
              src={HOME_IMAGES.mycelium} 
              alt="Mestrax Experience" 
              className="img-fluid w-100" 
              style={{ maxHeight: '420px', objectFit: 'cover' }} 
              onError={(e) => { e.currentTarget.src = HOME_IMAGES.fallback; }}
            />
            <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-black bg-opacity-75 rounded-3 border border-secondary border-opacity-25" style={{ backdropFilter: 'blur(8px)' }}>
              <h5 className="text-white mb-0 fw-bold">Mycelium Burger</h5>
              <small className="text-warning">★ Especial de la casa</small>
            </div>
          </div>
        </div>
      </section>

      {/* Destacados Section */}
      <section className="mt-5 pt-5 mb-5 border-top border-secondary border-opacity-10">
        <div className="text-center mb-5">
          <span className="text-warning small text-uppercase fw-bold tracking-wider d-block mb-2">Recomendados</span>
          <h2 className="fw-bolder display-6 text-white">Nuestros <span className="text-warning">Favoritos</span></h2>
          <p className="text-muted small">Lo más pedido y aclamado por nuestros clientes</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 bg-dark text-white border-secondary border-opacity-25 p-0 overflow-hidden shadow-sm">
              <img src={HOME_IMAGES.cosmo} alt="Cosmonopoly" className="card-img-top" style={{ height: '240px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold text-warning">Cosmonopoly</h5>
                <p className="text-muted small mb-0">Nuestro trago estrella diseñado para acompañar tus partidas más largas y estratégicas.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-dark text-white border-secondary border-opacity-25 p-0 overflow-hidden shadow-sm">
              <img src={HOME_IMAGES.rustica} alt="Paleo Rústica" className="card-img-top" style={{ height: '240px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold text-warning">Paleo Rústica</h5>
                <p className="text-muted small mb-0">La chorrillana crujiente y perfecta, ideal para compartir historias y victorias entre amigos.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 bg-dark text-white border-secondary border-opacity-25 p-0 overflow-hidden shadow-sm">
              <img src={HOME_IMAGES.brownie} alt="Brownie con Helado" className="card-img-top" style={{ height: '240px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = HOME_IMAGES.fallback; }} />
              <div className="p-4">
                <h5 className="fw-bold text-warning">Brownie Mágico</h5>
                <p className="text-muted small mb-0">El postre templado con helado ideal para coronar de forma dulce una gran noche.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="row g-4 mt-4 pt-4 border-top border-secondary border-opacity-10">
        <div className="col-md-4">
          <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 text-center h-100 shadow-sm">
            <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-egg-fried fs-3 text-warning"></i>
            </div>
            <h4 className="fw-bold text-white fs-5">Sabores Únicos</h4>
            <p className="text-muted small m-0">Ingredientes frescos combinados de forma creativa en cada plato de nuestra carta.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 text-center h-100 shadow-sm">
            <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-cup-straw fs-3 text-info"></i>
            </div>
            <h4 className="fw-bold text-white fs-5">Mixología de Autor</h4>
            <p className="text-muted small m-0">Disfruta de coctelería conceptual y mocktails equilibrados preparados al momento.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark bg-opacity-50 border-secondary border-opacity-25 p-4 text-center h-100 shadow-sm">
            <div className="bg-black bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-dice-5 fs-3 text-danger"></i>
            </div>
            <h4 className="fw-bold text-white fs-5">Ludoteca Disponible</h4>
            <p className="text-muted small m-0">Acceso completo a nuestra colección de juegos mientras compartes en la mesa.</p>
          </div>
        </div>
      </section>
    </main>
  );
}