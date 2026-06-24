import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
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


    Swal.fire({
      title: '¡Añadido con éxito!',
      text: `${producto.nombre} se agregó a tu orden.`,
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

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="mb-0 fw-medium text-muted">Buscando detalles del producto...</p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="container py-5 page-shell text-center">

        <div className="glass-panel p-5 mx-auto shadow" style={{ maxWidth: '560px' }}>
          <i className="bi bi-x-circle text-danger display-4 mb-3"></i>
          <h1 className="fw-bold mb-3" style={{ color: '#1a202c' }}>Producto no encontrado</h1>
          <p className="text-muted small mb-4">El platillo o bebida que buscas no existe o fue retirado de la carta.</p>
          <Link to="/productos" className="btn w-100">Volver al menú</Link>
        </div>
      </main>
    );
  }

  const disponible = producto.estado === 'Disponible';

  return (
    <main className="container py-5 page-shell">
      <div className="row g-5 align-items-center">
        <div className="col-lg-6">
          <div className="position-relative overflow-hidden rounded-4 shadow-lg border border-light-subtle">
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

          <span className="admin-chip px-3 py-2 rounded mb-3 small text-uppercase fw-bold d-inline-block">
            {producto.categoria}
          </span>
          

          <h1 className="fw-black display-4 mb-2" style={{ color: '#1a202c' }}>{producto.nombre}</h1>
          
          <p className="text-muted mb-4 fs-5" style={{ lineHeight: '1.6' }}>
            Una creación exclusiva de la cocina de Mestrax, preparada al momento con ingredientes seleccionados de la más alta calidad para garantizar una experiencia de sabor única.
          </p>
          

          <p className="fw-bold display-6 mb-4" style={{ color: '#6366f1' }}>{dinero(producto.precio)}</p>
          
          {!disponible && (
            <div className="alert alert-danger bg-danger bg-opacity-10 border-0 text-danger small mb-4 py-2 rounded-3">
              Este producto se encuentra pausado y no admite pedidos por el momento.
            </div>
          )}
          
          <div className="d-flex flex-wrap gap-3">

            <button 
              className={`btn btn-lg px-4 py-3 fw-bold ${!disponible ? 'secondary opacity-50 text-muted' : ''}`} 
              type="button" 
              onClick={agregarAlCarrito} 
              disabled={!disponible}
            >
              <i className="bi bi-cart-plus-fill me-2"></i>Agregar al carrito
            </button>
            

            <Link to="/productos" className="btn secondary btn-lg px-4 py-3 fw-medium text-decoration-none">
              Volver al menú
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}