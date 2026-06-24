import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  API_BASE,
  PRODUCTOS_FALLBACK,
  PRODUCTOS_IMAGES,
  dinero,
  normalizeProducto,
  normalizarTexto,
} from '../data/productos';

const CATEGORIAS = [
  'Todas',
  'Hamburguesas',
  'Entradas',
  'Chorrillanas',
  'Tragos',
  'Mocktails',
  'Cafeteria',
  'Postres',
  'Bebidas',
];

export default function Producto({ carrito, actualizarCarrito }) {
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(PRODUCTOS_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el menu');
        }

        const data = await response.json();
        setProductos(Array.isArray(data) && data.length > 0 ? data.map(normalizeProducto) : PRODUCTOS_FALLBACK);
      } catch (error) {
        console.error(error);
        setProductos(PRODUCTOS_FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda);

    return productos.filter((producto) => {
      const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
      const coincideBusqueda = normalizarTexto(producto.nombre).includes(textoBusqueda);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoria, busqueda]);

  const agregarAlCarrito = (producto) => {
    const productoNormalizado = normalizeProducto(producto);

    if (productoNormalizado.estado !== 'Disponible') {

      Swal.fire({
        title: 'No disponible',
        text: `${productoNormalizado.nombre} no está disponible por ahora.`,
        icon: 'error',
        background: '#ffffff',
        color: '#2d3748',
        iconColor: '#f87171',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-4 shadow border-0',
          confirmButton: 'btn secondary px-4'
        },
        buttonsStyling: false
      });
      return;
    }

    const nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((item) => item.id === productoNormalizado.id);

    if (index !== -1) {
      nuevoCarrito[index] = {
        ...nuevoCarrito[index],
        cantidad: (nuevoCarrito[index].cantidad || 1) + 1,
      };
    } else {
      nuevoCarrito.push({ ...productoNormalizado, cantidad: 1 });
    }

    actualizarCarrito(nuevoCarrito);


    Swal.fire({
      title: '¡Agregado al carrito!',
      text: `${productoNormalizado.nombre} se sumó a tu orden.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      background: '#ffffff',
      color: '#2d3748',
      iconColor: '#c084fc', 
      customClass: {
        popup: 'rounded-4 shadow border border-light-subtle'
      }
    });
  };

  return (
    <main className="container py-5 page-shell">

      <section className="text-center mb-5 mt-3">

        <div className="badge-modern text-uppercase">
          Menú Exclusivo
        </div>
        <h2 className="fw-bolder m-0 display-5 text-gradient">Nuestra Selección</h2>
      </section>

      <section className="mb-5">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 p-2 mx-auto filter-bar-modern" style={{ maxWidth: '900px' }}>
          <div className="position-relative flex-grow-1 w-100">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
            <input
              type="text"
              className="form-control bg-transparent border-0 ps-5 py-3 shadow-none w-100"
              placeholder="Busca tu plato o bebida favorita..."
              style={{ fontSize: '1.05rem', color: '#2d3748' }}
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <div className="divider d-none d-md-block"></div>

          <div className="position-relative w-100 category-select-container">
            <i className="bi bi-funnel position-absolute top-50 start-0 translate-middle-y ms-3 text-muted z-1"></i>
            <select
              className="form-select border-0 ps-5 py-3 shadow-none w-100 fw-medium"
              style={{ cursor: 'pointer', background: 'transparent', color: '#2d3748' }}
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {CATEGORIAS.map((item) => (
                <option key={item} value={item} className="bg-white text-dark">
                  {item === 'Todas' ? 'Todo el menú' : item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="text-center text-muted py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 fw-medium">Cargando la carta de Mestrax...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (

          <div className="glass-panel p-5 text-center shadow rounded-3">
            <i className="bi bi-exclamation-circle text-danger display-4 mb-3"></i>
            <p className="mb-0 text-muted fs-5">No encontramos productos que coincidan con tus filtros.</p>
          </div>
        ) : (
          <div className="row g-4">
            {productosFiltrados.map((producto) => {
              const disponible = producto.estado === 'Disponible';

              return (
                <div key={producto.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">

                  <div className="card h-100 glass-panel p-0 overflow-hidden shadow-sm border-0">
                    <Link to={`/producto/${producto.id}`} className="text-decoration-none">
                      <div className="position-relative">
                        <img
                          src={producto.img}
                          className="card-img-top"
                          alt={producto.nombre}
                          style={{ height: '200px', objectFit: 'cover', filter: disponible ? 'none' : 'grayscale(1)' }}
                          onError={(event) => {
                            event.currentTarget.src = PRODUCTOS_IMAGES.default || PRODUCTOS_FALLBACK[0].img;
                          }}
                        />
                        {!disponible && (
                          <span className="position-absolute top-0 end-0 m-2 badge bg-secondary px-2 py-1 fw-bold">
                            Agotado
                          </span>
                        )}
                      </div>
                    </Link>
                    
                    <div className="card-body d-flex flex-column p-4">
                      <div className="mb-1">
                        <h5 className="card-title fw-bold mb-1 fs-5" style={{ color: '#1a202c' }}>{producto.nombre}</h5>
                        <span className="admin-chip px-2 py-1 rounded" style={{ fontSize: '0.75rem' }}>
                          {producto.categoria}
                        </span>
                      </div>
                      
                      <p className="card-text fw-bold mt-3 mb-3 fs-5" style={{ color: '#6366f1' }}>
                        {dinero(producto.precio)}
                      </p>
                      

                      <button
                        className={`btn w-100 mt-auto fw-bold py-2 ${!disponible ? 'secondary opacity-50 text-muted' : ''}`}
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!disponible}
                      >
                        {disponible ? 'Agregar al carrito' : 'No disponible'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}