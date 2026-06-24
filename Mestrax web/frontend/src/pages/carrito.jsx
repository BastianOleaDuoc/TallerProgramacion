import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE, PRODUCTOS_IMAGES, dinero, normalizeCarritoItem } from '../data/productos';

export default function Carrito({ usuario, carrito, actualizarCarrito }) {
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(false); 
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  const items = carrito.map(normalizeCarritoItem);
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);


  const vaciarCarrito = () => {
    if (items.length === 0) return;
    
    Swal.fire({
      title: '¿Quieres vaciar el carrito?',
      text: 'Se eliminarán todos los productos seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#2d3748',
      iconColor: '#f87171',
      customClass: {
        popup: 'rounded-4 shadow border-0',
        confirmButton: 'btn secondary px-4 mx-2',
        cancelButton: 'btn btn-light border px-4 mx-2'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarCarrito([]);
        Swal.fire({
          title: '¡Carrito vacío!',
          icon: 'success',
          background: '#ffffff',
          color: '#2d3748',
          iconColor: '#c084fc',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-4 shadow border-0'
          }
        });
      }
    });
  };

  const eliminarProducto = (id) => {
    actualizarCarrito(items.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(id);
      return;
    }
    actualizarCarrito(
      items.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  };

  const obtenerCliente = () => {
    if (!usuario) return 'Cliente invitado';
    if (typeof usuario === 'string') return usuario;
    return usuario.nombre || usuario.email || 'Cliente invitado';
  };

  const obtenerResumenProductos = () => {
    return items.map((item) => `${item.cantidad}x ${item.nombre}`).join(', ');
  };

  const finalizarPedido = async () => {
    if (items.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega productos a tu pedido antes de finalizar.',
        icon: 'info',
        background: '#ffffff',
        color: '#2d3748',
        iconColor: '#6366f1',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-4 shadow border-0',
          confirmButton: 'btn px-4'
        },
        buttonsStyling: false
      });
      return;
    }

    setIsSubmitting(true);
    setMensaje('');
    setError('');

    try {
      const response = await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: obtenerCliente(),
          producto: obtenerResumenProductos(),
          total,
          metodo: metodoPago, 
          estado: 'Pagada',
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo registrar la venta');
      }

      setMensaje(`¡Venta registrada con éxito por ${dinero(total)}!`);
      setPedidoCompletado(true);
      actualizarCarrito([]);
    } catch (submitError) {
      console.error(submitError);
      setError('No se pudo registrar la venta. Revisa que el backend esté ejecutándose.');
      Swal.fire({
        title: 'Error en el servidor',
        text: 'No pudimos procesar la orden. ¿El backend está encendido?',
        icon: 'error',
        background: '#ffffff',
        color: '#2d3748',
        iconColor: '#f87171',
        confirmButtonText: 'Reintentar',
        customClass: {
          popup: 'rounded-4 shadow border-0',
          confirmButton: 'btn secondary px-4'
        },
        buttonsStyling: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (pedidoCompletado) {
    return (
      <main className="container py-5 page-shell text-center">
        <div className="glass-panel p-5 mx-auto shadow rounded-4" style={{ maxWidth: '500px' }}>
          <i className="bi bi-check-circle-fill fs-1 mb-3 d-block" style={{ color: '#c084fc' }}></i>
          <h3 className="fw-bold text-gradient mb-2">¡Pedido Recibido!</h3>
          <p className="mb-4 text-muted fw-medium">{mensaje}</p>
          
          {/* Caja resumen adaptada a fondo gris pastel */}
          <div className="p-3 rounded-3 mb-4 border border-light-subtle text-start" style={{ background: '#f1f5f9' }}>
            <small className="d-block text-muted mb-1 text-uppercase tracking-wider fw-semibold">Método de pago procesado</small>
            <span className="fw-bold" style={{ color: '#6366f1' }}>{metodoPago}</span>
          </div>
          
          <p className="small text-muted mb-4">Tu orden ya aparece en tiempo real en el Panel de Administración de Mestrax.</p>
          <Link to="/productos" className="btn w-100 py-2 fw-bold text-decoration-none" onClick={() => setPedidoCompletado(false)}>
            Seguir explorando la carta
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="badge-modern">Tu pedido</span>
        <h2 className="fw-bold mt-3 mb-0 text-gradient">Carrito de Compras</h2>
      </div>

      {items.length === 0 ? (
        <section className="glass-panel p-5 text-center shadow rounded-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <i className="bi bi-cart-x text-muted fs-1 mb-3"></i>
          <p className="mb-4 text-muted fw-semibold">Tu carrito está actualmente vacío.</p>
          <Link to="/productos" className="btn px-4 text-decoration-none">Ver productos</Link>
        </section>
      ) : (
        <section>
          {/* TABLA MODERNIZADA (SIN COLOR NEGRO FIJO DE BOOTSTRAP) */}
          <div className="table-responsive shadow rounded-4 border border-light-subtle bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8f9fa' }}>
                <tr style={{ color: '#4a5568' }}>
                  <th className="py-3 ps-4">Producto</th>
                  <th className="text-end py-3">Precio</th>
                  <th className="text-center py-3">Cantidad</th>
                  <th className="text-end py-3">Subtotal</th>
                  <th className="text-center py-3 pe-4">Acción</th>
                </tr>
              </thead>
              <tbody style={{ color: '#2d3748' }}>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '12px' }}
                          onError={(event) => {
                            event.currentTarget.src = PRODUCTOS_IMAGES.default;
                          }}
                        />
                        <span className="fw-semibold" style={{ color: '#1a202c' }}>{item.nombre}</span>
                      </div>
                    </td>
                    <td className="text-end text-muted fw-medium">{dinero(item.precio)}</td>
                    <td className="text-center">
                      {/* Control de cantidad con fondo pastel sutil */}
                      <div className="d-inline-flex align-items-center gap-2 p-1 rounded-3 border border-light-subtle" style={{ background: '#f8f9fa' }}>
                        <button className="btn btn-sm secondary py-0 px-2 fw-bold" type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                        <span className="fw-bold px-2" style={{ minWidth: '28px', display: 'inline-block', color: '#1a202c' }}>{item.cantidad}</span>
                        <button className="btn btn-sm secondary py-0 px-2 fw-bold" type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end fw-bold" style={{ color: '#6366f1' }}>{dinero(item.precio * item.cantidad)}</td>
                    <td className="text-center pe-4">
                      <button className="btn btn-sm secondary text-danger border-danger-subtle py-1 px-3" type="button" onClick={() => eliminarProducto(item.id)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ background: '#f8f9fa' }}>
                <tr className="border-0">
                  <td colSpan="3" className="text-end fw-bold text-muted py-3">Total a pagar:</td>
                  <td className="text-end fw-bold fs-5 py-3" style={{ color: '#6366f1' }}>{dinero(total)}</td>
                  <td className="pe-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* PANEL DE PAGO ESTILO PASTEL */}
          <div className="glass-panel p-4 mt-4 shadow rounded-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <label className="form-label text-muted small text-uppercase fw-bold tracking-wider mb-2">Método de pago</label>
                <select 
                  className="form-select fw-semibold border-light-subtle" 
                  style={{ background: '#f1f5f9', color: '#2d3748', height: '48px' }} 
                  value={metodoPago} 
                  onChange={(event) => setMetodoPago(event.target.value)}
                >
                  <option value="Efectivo" className="text-dark">💵 Efectivo</option>
                  <option value="Tarjeta" className="text-dark">💳 Tarjeta de Crédito/Débito</option>
                  <option value="Transferencia" className="text-dark">🏦 Transferencia Bancaria</option>
                </select>
              </div>
              <div className="col-md-7 text-md-end mt-4 mt-md-0">
                <p className="text-muted small mb-1fw-medium">La venta quedará registrada de inmediato en el panel admin.</p>
                <span className="text-muted me-2 fw-semibold">Monto total:</span>
                <strong className="fs-3 fw-bold" style={{ color: '#6366f1' }}>{dinero(total)}</strong>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 mt-3 mb-0 rounded-3">{error}</div>}
          </div>
          
          {/* ACCIONES DEL CARRITO COMPATIBLES CON TU CSS */}
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4">
            <button className="btn secondary px-4 py-2" type="button" onClick={vaciarCarrito}>Vaciar carrito</button>
            <button className="btn px-5 py-2" type="button" onClick={finalizarPedido} disabled={isSubmitting}>
              {isSubmitting ? 'Registrando pedido...' : '💡 Finalizar pedido'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}