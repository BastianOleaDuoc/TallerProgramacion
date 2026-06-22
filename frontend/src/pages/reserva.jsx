import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_BASE } from '../data/productos';

const RESERVA_IMAGES = {
  fondo: new URL('../img/rustica.png', import.meta.url).href,
  fallback: new URL('../img/unnamed.png', import.meta.url).href,
};

const POSICIONES_MESAS = [
  { id: 1, top: '10%', left: '10%' },
  { id: 2, top: '10%', left: '30%' },
  { id: 3, top: '10%', left: '50%' },
  { id: 4, top: '10%', left: '70%' },
  { id: 5, top: '30%', left: '10%' },
  { id: 6, top: '30%', left: '30%' },
  { id: 7, top: '30%', left: '50%' },
  { id: 8, top: '30%', left: '70%' },
  { id: 9, top: '50%', left: '20%' },
  { id: 10, top: '50%', left: '40%' },
  { id: 11, top: '50%', left: '60%' },
  { id: 12, top: '70%', left: '15%' },
  { id: 13, top: '70%', left: '35%' },
  { id: 14, top: '70%', left: '55%' },
  { id: 15, top: '70%', left: '75%' },
];

function crearFormularioInicial(usuario) {
  return {
    nombre: usuario?.nombre || '',
    telefono: '',
    email: usuario?.email || '',
    personas: 2,
    fecha: '',
    hora: '',
    comentarios: '',
  };
}

export default function Reserva({ usuario }) {
  const [form, setForm] = useState(() => crearFormularioInicial(usuario));
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [isLoadingOcupadas, setIsLoadingOcupadas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const mesasOcupadas = useMemo(
    () => [
      ...new Set(
        reservasOcupadas
          .map((reserva) => Number(reserva.mesa))
          .filter((mesa) => Number.isInteger(mesa) && mesa > 0)
      ),
    ],
    [reservasOcupadas]
  );

  const mesasDisponibles = useMemo(
    () => POSICIONES_MESAS
      .map((mesa) => mesa.id)
      .filter((mesa) => !mesasOcupadas.includes(mesa)),
    [mesasOcupadas]
  );

  const horarioSeleccionado = Boolean(form.fecha && form.hora);

  const cargarMesasOcupadas = useCallback(async (fecha, hora) => {
    if (!fecha || !hora) {
      setReservasOcupadas([]);
      setMesaSeleccionada(null);
      return;
    }

    setIsLoadingOcupadas(true);

    try {
      const params = new URLSearchParams({ fecha, hora });
      const response = await fetch(`${API_BASE}/reservas/ocupadas?${params.toString()}`);

      if (!response.ok) {
        throw new Error('No se pudo sincronizar la disponibilidad de mesas.');
      }

      const data = await response.json();
      const ocupadas = Array.isArray(data) ? data : [];
      setReservasOcupadas(ocupadas);
      setMesaSeleccionada((mesaActual) =>
        ocupadas.some((reserva) => Number(reserva.mesa) === mesaActual) ? null : mesaActual
      );
    } catch (loadError) {
      console.error(loadError);
      setReservasOcupadas([]);
      setError('No se pudo sincronizar la disponibilidad de mesas.');
    } finally {
      setIsLoadingOcupadas(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      cargarMesasOcupadas(form.fecha, form.hora);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cargarMesasOcupadas, form.fecha, form.hora]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'fecha' || name === 'hora') {
      setMesaSeleccionada(null);
      setMensaje('');
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensaje('');
    setError('');

    if (!mesaSeleccionada) {
      setError('Selecciona una mesa disponible antes de enviar la reserva.');
      return;
    }

    if (mesasOcupadas.includes(mesaSeleccionada)) {
      setMesaSeleccionada(null);
      setError('Esa mesa ya esta reservada para ese horario. Elige otra mesa disponible.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          fecha: form.fecha,
          hora: form.hora,
          personas: Number(form.personas),
          mesa: mesaSeleccionada,
          comentarios: form.comentarios.trim(),
          estado: 'Pendiente',
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Esa mesa ya esta reservada para ese horario. Elige otra mesa disponible.');
        }

        throw new Error('No se pudo guardar la reserva.');
      }

      setMensaje(`Reserva enviada para la mesa ${mesaSeleccionada}. Te esperamos en Mestrax.`);
      setMesaSeleccionada(null);
      setForm(crearFormularioInicial(usuario));
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || 'No se pudo enviar la reserva. Revisa que el backend este ejecutandose.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5 page-shell">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <section className="hero p-0 mb-4 rounded-4 shadow-sm bg-dark text-white overflow-hidden position-relative" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={RESERVA_IMAGES.fondo} alt="Fondo Reserva" className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover', opacity: '0.3' }} onError={(event) => { event.currentTarget.src = RESERVA_IMAGES.fallback; }} />
            <div className="position-relative p-4 text-center z-1">
              <h2 className="fw-bold display-6">Reserva tu mesa</h2>
              <p className="mb-0 fs-5 text-light">Elige tu dia, hora y numero de personas para vivir una experiencia unica.</p>
            </div>
          </section>

          <div className="card shadow-lg border-0 rounded-4 bg-black text-light">
            <div className="card-body p-4">
              <h3 className="mb-4">Formulario de reserva</h3>
              <form id="reservaForm" onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" className="form-control bg-secondary text-white border-0" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">Telefono</label>
                    <input type="tel" id="telefono" name="telefono" className="form-control bg-secondary text-white border-0" placeholder="+56 9 1234 5678" value={form.telefono} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Correo electronico</label>
                    <input type="email" id="email" name="email" className="form-control bg-secondary text-white border-0" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="personas" className="form-label">Personas</label>
                    <input type="number" id="personas" name="personas" className="form-control bg-secondary text-white border-0" min="1" max="12" value={form.personas} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <input type="date" id="fecha" name="fecha" className="form-control bg-secondary text-white border-0" value={form.fecha} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="hora" className="form-label">Hora</label>
                    <input type="time" id="hora" name="hora" className="form-control bg-secondary text-white border-0" value={form.hora} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="comentarios" className="form-label">Comentarios</label>
                    <textarea id="comentarios" name="comentarios" rows="4" className="form-control bg-secondary text-white border-0" placeholder="Ej. Mesa junto a la ventana..." value={form.comentarios} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-12">
                    {mensaje && <div className="alert alert-success py-2 mb-0">{mensaje}</div>}
                    {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-danger px-4 py-2" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar reserva'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-lg border-0 rounded-4 bg-black text-light mt-4">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <h3 className="mb-0">Selecciona tu mesa</h3>
                <span className="admin-chip">Mesa elegida: {mesaSeleccionada || 'ninguna'}</span>
              </div>
              <p className="text-muted small mb-3">
                {horarioSeleccionado
                  ? isLoadingOcupadas
                    ? 'Sincronizando mesas con reservas...'
                    : `${mesasDisponibles.length} disponibles y ${mesasOcupadas.length} ocupadas para ese horario.`
                  : 'Selecciona fecha y hora para ver la disponibilidad real.'}
              </p>
              <div className="mesa-legend mb-3">
                <span><i className="mesa-dot libre"></i>Disponible</span>
                <span><i className="mesa-dot ocupada"></i>Reservada</span>
                <span><i className="mesa-dot bloqueada"></i>Sin horario</span>
              </div>
              <div className="mesa-status-grid mb-4">
                <div className="mesa-status-box libre">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                    <span className="fw-semibold">Disponibles</span>
                    <strong>{horarioSeleccionado ? mesasDisponibles.length : '-'}</strong>
                  </div>
                  <div className="mesa-chip-list">
                    {horarioSeleccionado ? (
                      mesasDisponibles.map((mesa) => (
                        <span key={`disponible-${mesa}`} className="mesa-chip mesa-chip-libre">Mesa {mesa}</span>
                      ))
                    ) : (
                      <span className="text-muted small">Elige fecha y hora.</span>
                    )}
                  </div>
                </div>
                <div className="mesa-status-box ocupada">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                    <span className="fw-semibold">Ocupadas</span>
                    <strong>{horarioSeleccionado ? mesasOcupadas.length : '-'}</strong>
                  </div>
                  <div className="mesa-chip-list">
                    {horarioSeleccionado && mesasOcupadas.length > 0 ? (
                      mesasOcupadas.map((mesa) => (
                        <span key={`ocupada-${mesa}`} className="mesa-chip mesa-chip-ocupada">Mesa {mesa}</span>
                      ))
                    ) : (
                      <span className="text-muted small">
                        {horarioSeleccionado ? 'No hay mesas ocupadas.' : 'Elige fecha y hora.'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div id="mapaRestaurante" className="restaurante-layout">
                <div className="entrada"><span>Entrada</span></div>
                <div className="area-principal">
                  {POSICIONES_MESAS.map((mesa) => {
                    const ocupada = mesasOcupadas.includes(mesa.id);
                    const seleccionada = mesaSeleccionada === mesa.id;
                    const sinHorario = !horarioSeleccionado;
                    const bloqueada = ocupada || sinHorario || isLoadingOcupadas;
                    const estadoMesa = ocupada ? 'reservada' : bloqueada ? 'sin horario' : 'disponible';

                    return (
                      <button
                        key={mesa.id}
                        type="button"
                        className={`mesa ${ocupada ? 'ocupada' : ''} ${bloqueada && !ocupada ? 'bloqueada' : ''} ${!bloqueada && !seleccionada ? 'libre' : ''} ${seleccionada ? 'seleccionada' : ''}`}
                        style={{ position: 'absolute', top: mesa.top, left: mesa.left }}
                        onClick={() => !bloqueada && setMesaSeleccionada(mesa.id)}
                        disabled={bloqueada}
                        aria-label={`Mesa ${mesa.id} ${estadoMesa}`}
                        title={`Mesa ${mesa.id} ${estadoMesa}`}
                      >
                        {mesa.id}
                      </button>
                    );
                  })}
                </div>
                <div className="barra"><span>Barra</span></div>
                <div className="cocina"><span>Cocina</span></div>
              </div>
              <p className="mt-3 text-muted">Elige una mesa verde disponible. Las mesas rojas ya estan ocupadas.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
