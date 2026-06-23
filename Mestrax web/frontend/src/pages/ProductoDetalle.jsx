import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  API_BASE,
  PRODUCTOS_FALLBACK,
  PRODUCTOS_IMAGES,
  dinero,
  normalizeProducto,
} from '../data/productos';

export default function ProductoDetalle({ carrito, actualizarCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await fetch(`${API_BASE}/productos/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado en API');
        }

        const data = await response.json();
        setProducto(normalizeProducto(data));
      } catch {
        const fallback = PRODUCTOS_FALLBACK.find((item) => String(item.id) === String(id));
        setProducto(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const agregarAlCarrito = () => {
    if (!producto || producto.estado !== 'Disponible') {
      return;
    }

    const nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      nuevoCarrito[index] = {
        ...nuevoCarrito[index],
        cantidad: (nuevoCarrito[index].cantidad || 1) + 1,
      };
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito(nuevoCarrito);
    alert(`¡Agregado con éxito!\n${producto.nombre} ya está en tu carrito.`);
  };

  if (loading) {
    return (
      <main className="container py-5 text-center text-white">
        <div className="spinner-border text-warning mb-3" role="status"></div>
        <p className="mb-0 fw-medium text-muted">Buscando detalles del producto...</p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="container py-5 page-shell text-center text-white">
        <div className="card bg-dark border-secondary border-opacity-25 p-5 mx-auto shadow" style={{ maxWidth: '560px' }}>
          <i className="bi bi-x-circle text-danger display-4 mb-3"></i>
          <h1 className="fw-bold mb-3 text-white">Producto no encontrado</h1>
          <p className="text-muted small mb-4">El platillo o bebida que buscas no existe o fue retirado de la carta.</p>
          <Link to="/productos" className="btn btn-warning text-dark fw-bold w-100">Volver al menú</Link>
        </div>
      </main>
    );
  }

  const disponible = producto.estado === 'Disponible';

  return (
    <main className="container py-5 page-shell text-white">
      <div className="row g-5 align-items-center">
        {/* Columna Imagen */}
        <div className="col-lg-6">
          <div className="position-relative overflow-hidden rounded-4 shadow-lg border border-secondary border-opacity-10">
            <img
              src={producto.img}
              alt={producto.nombre}
              className="w-100"
              style={{ maxHeight: '520px', objectFit: 'cover', filter: disponible ? 'none' : 'grayscale(1)' }}
              onError={(event) => {
                event.currentTarget.src = PRODUCTOS_IMAGES.default || PRODUCTOS_FALLBACK[0].img;
              }}
            />
            {!disponible && (
              <span className="position-absolute top-0 end-0 m-3 badge bg-secondary px-3 py-2 fw-bold fs-6 shadow">
                Agotado temporalmente
              </span>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <span className="badge bg-secondary bg-opacity-25 text-warning px-3 py-2 rounded mb-3 small text-uppercase fw-bold">
            {producto.categoria}
          </span>
          <h1 className="fw-black display-4 mb-2 text-white">{producto.nombre}</h1>
          <p className="text-muted mb-4 fs-5" style={{ lineHeight: '1.6' }}>
            Una creación exclusiva de la cocina de Mestrax, preparada al momento con ingredientes seleccionados de la más alta calidad para garantizar una experiencia de sabor única.
          </p>
          
          <p className="fw-bold display-6 mb-4 text-warning">{dinero(producto.precio)}</p>
          
          {!disponible && (
            <div className="alert alert-danger bg-danger bg-opacity-10 border-0 text-danger small mb-4 py-2">
              Este producto se encuentra pausado y no admite pedidos por el momento.
            </div>
          )}
          
          <div className="d-flex flex-wrap gap-3">
            <button 
              className={`btn btn-lg px-4 py-3 fw-bold ${disponible ? 'btn-warning text-dark shadow-sm' : 'btn-outline-secondary text-muted'}`} 
              type="button" 
              onClick={agregarAlCarrito} 
              disabled={!disponible}
            >
              <i className="bi bi-cart-plus-fill me-2"></i>Agregar al carrito
            </button>
            <Link to="/productos" className="btn btn-outline-light btn-lg px-4 py-3 fw-medium text-decoration-none">
              Volver al menú
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}