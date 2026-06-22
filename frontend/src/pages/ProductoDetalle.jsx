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
    alert(`Producto agregado\n${producto.nombre} ya esta en tu carrito`);
  };

  if (loading) {
    return (
      <main className="container py-5 text-center text-white">
        <p className="mb-0">Cargando producto...</p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="container py-5 page-shell text-center">
        <div className="card glass-panel p-4 mx-auto" style={{ maxWidth: '560px' }}>
          <h1 className="fw-bold mb-3">Producto no encontrado</h1>
          <Link to="/productos" className="btn btn-primary">Volver al menu</Link>
        </div>
      </main>
    );
  }

  const disponible = producto.estado === 'Disponible';

  return (
    <main className="container py-5 page-shell">
      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <img
            src={producto.img}
            alt={producto.nombre}
            className="rounded-4 shadow-lg w-100"
            style={{ maxHeight: '520px', objectFit: 'cover' }}
            onError={(event) => {
              event.currentTarget.src = PRODUCTOS_IMAGES.default;
            }}
          />
        </div>
        <div className="col-lg-6">
          <span className="soft-badge">{producto.categoria}</span>
          <h1 className="fw-bolder display-5 mt-3">{producto.nombre}</h1>
          <p className="text-muted mb-4">
            Producto de la carta Mestrax, listo para sumar a tu pedido.
          </p>
          <p className="fw-bold fs-2 mb-4" style={{ color: '#60a5fa' }}>{dinero(producto.precio)}</p>
          {!disponible && <p className="alert alert-warning">Este producto no esta disponible por ahora.</p>}
          <div className="d-flex flex-wrap gap-3">
            <button className="btn-primary-modern px-4 py-2" type="button" onClick={agregarAlCarrito} disabled={!disponible}>
              Agregar al carrito
            </button>
            <Link to="/productos" className="btn-secondary-modern px-4 py-2 text-decoration-none">Volver al menu</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
