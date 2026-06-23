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

  // Alerta Premium para vaciar el carrito
  const vaciarCarrito = () => {
    if (items.length === 0) return;
    
    Swal.fire({
      title: '¿Quieres vaciar el carrito?',
      text: 'Se eliminarán todos los productos seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      background: '#12131c',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarCarrito([]);
        Swal.fire({
          title: '¡Carrito vacío!',
          icon: 'success',
          background: '#12131c',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
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
        confirmButtonColor: '#ffc107',
        background: '#12131c',
        color: '#fff'
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
        confirmButtonColor: '#ef4444',
        background: '#12131c',
        color: '#fff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- INTERFAZ: PEDIDO EXITOSO ---
  if (pedidoCompletado) {
    return (
      <main className="container py-5 page-shell text-center">
        <div className="card glass-panel p-5 mx-auto text-white" style={{ maxWidth: '500px' }}>
          <i className="bi bi-check-circle-fill text-warning fs-1 mb-3 d-block"></i>
          <h3 className="fw-bold text-gradient mb-2">¡Pedido Recibido!</h3>
          <p className="mb-4 text-muted">{mensaje}</p>
          
          <div className="p-3 bg-black bg-opacity-40 rounded-3 mb-4 border border-white border-opacity-10 text-start">
            <small className="d-block text-muted mb-1 text-uppercase tracking-wider">Método de pago procesado</small>
            <span className="fw-bold text-warning">{metodoPago}</span>
          </div>
          
          <p className="small text-muted mb-4">Tu orden ya aparece en tiempo real en el Panel de Administración de Mestrax.</p>
          <Link to="/productos" className="btn btn-primary-modern w-100 py-2 fw-bold" onClick={() => setPedidoCompletado(false)}>
            Seguir explorando la carta
          </Link>
        </div>
      </main>
    );
  }

  // --- INTERFAZ: CARRITO PRINCIPAL ---
  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Tu pedido</span>
        <h2 className="fw-bold mt-3 mb-0 text-gradient">Carrito de Compras</h2>
      </div>

      {items.length === 0 ? (
        <section className="card glass-panel p-5 text-center text-white" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <i className="bi bi-cart-x text-muted fs-1 mb-3"></i>
          <p className="mb-4 text-muted">Tu carrito está actualmente vacío.</p>
          <Link to="/productos" className="btn btn-primary-modern px-4">Ver productos</Link>
        </section>
      ) : (
        <section>
          <div className="table-responsive shadow rounded-4 border border-white border-opacity-10">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '12px' }}
                          onError={(event) => {
                            event.currentTarget.src = PRODUCTOS_IMAGES.default;
                          }}
                        />
                        <span className="fw-medium">{item.nombre}</span>
                      </div>
                    </td>
                    <td className="text-end text-muted">{dinero(item.precio)}</td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-2 bg-black bg-opacity-30 p-1 rounded-3 border border-white border-opacity-10">
                        <button className="btn btn-sm btn-secondary-modern py-1 px-2" type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                        <span className="fw-bold px-2" style={{ minWidth: '28px', display: 'inline-block' }}>{item.cantidad}</span>
                        <button className="btn btn-sm btn-secondary-modern py-1 px-2" type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end text-warning fw-bold">{dinero(item.precio * item.cantidad)}</td>
                    <td className="text-center">
                      <button className="btn btn-sm button danger py-1 px-3" type="button" onClick={() => eliminarProducto(item.id)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold text-muted">Total a pagar:</td>
                  <td className="text-end fw-bold text-warning fs-5">{dinero(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="card glass-panel p-4 mt-4 text-white">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <label className="form-label text-muted small text-uppercase fw-bold tracking-wider mb-2">Método de pago</label>
                <select className="form-select text-white border-white border-opacity-10" style={{ background: '#0b0c10' }} value={metodoPago} onChange={(event) => setMetodoPago(event.target.value)}>
                  <option value="Efectivo">💵 Efectivo</option>
                  <option value="Tarjeta">💳 Tarjeta de Crédito/Débito</option>
                  <option value="Transferencia">🏦 Transferencia Bancaria</option>
                </select>
              </div>
              <div className="col-md-7 text-md-end mt-4 mt-md-0">
                <p className="text-muted small mb-1">La venta quedará registrada de inmediato en el panel admin.</p>
                <span className="text-muted me-2">Monto total:</span>
                <strong className="text-warning fs-4">{dinero(total)}</strong>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
          </div>
          
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4">
            <button className="btn btn-secondary-modern px-4 py-2" type="button" onClick={vaciarCarrito}>Vaciar carrito</button>
            <button className="btn btn-primary-modern px-5 py-2" type="button" onClick={finalizarPedido} disabled={isSubmitting}>
              {isSubmitting ? 'Registrando pedido...' : '💡 Finalizar pedido'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}