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
          .filter((r) => r.fecha === form.fecha && r.hora.startsWith(form.hora.substring(0, 5)))
          .map((reserva) => Number(reserva.mesa))
          .filter((mesa) => Number.isInteger(mesa) && mesa > 0)
      ),
    ],
    [reservasOcupadas, form.fecha, form.hora]
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
      const response = await fetch(`${API_BASE}/reservas`);

      if (!response.ok) {
        throw new Error('No se pudo sincronizar la disponibilidad de mesas.');
      }

      const data = await response.json();
      setReservasOcupadas(Array.isArray(data) ? data : []);
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
      setError('Esa mesa ya está reservada para ese horario. Elige otra mesa disponible.');
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
          hora: form.hora.includes(':') && form.hora.split(':').length === 2 ? `${form.hora}:00` : form.hora,
          personas: Number(form.personas),
          mesa: Number(mesaSeleccionada),
          comentarios: form.comentarios.trim(),
          estado: 'Confirmada',
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Esa mesa ya está reservada para ese horario. Elige otra mesa disponible.');
        }
        throw new Error('No se pudo guardar la reserva.');
      }

      setMensaje(`¡Reserva confirmada con éxito para la mesa ${mesaSeleccionada}! Te esperamos en Mestrax.`);
      setMesaSeleccionada(null);
      setForm(crearFormularioInicial(usuario));
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message || 'No se pudo enviar la reserva. Revisa que el backend esté ejecutándose.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5 page-shell text-white">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          

          <section className="hero p-0 mb-4 rounded-4 shadow overflow-hidden position-relative bg-dark border border-secondary border-opacity-25" style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={RESERVA_IMAGES.fondo} alt="Fondo Reserva" className="w-100 h-100 position-absolute top-0 start-0" style={{ objectFit: 'cover', opacity: '0.15' }} onError={(event) => { event.currentTarget.src = RESERVA_IMAGES.fallback; }} />
            <div className="position-relative p-4 text-center z-1">
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold small text-uppercase mb-2">Salón Interactivo</span>
              <h2 className="fw-black display-6 m-0 text-white">Reserva tu Mesa</h2>
              <p className="mb-0 fs-6 text-muted mt-1">Elige el día, la hora y asegura tu lugar preferido en segundos.</p>
            </div>
          </section>


          <div className="card shadow-sm border-secondary border-opacity-25 rounded-4 bg-dark text-white mb-4">
            <div className="card-body p-4">
              <h3 className="h5 fw-bold text-white mb-4 border-bottom border-secondary border-opacity-15 pb-2">
                <i className="bi bi-file-earmark-text text-warning me-2"></i>Datos de la Reserva
              </h3>
              
              <form id="reservaForm" onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label small text-uppercase text-muted">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label small text-uppercase text-muted">Teléfono de contacto</label>
                    <input type="tel" id="telefono" name="telefono" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" placeholder="+56 9 1234 5678" value={form.telefono} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label small text-uppercase text-muted">Correo electrónico</label>
                    <input type="email" id="email" name="email" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="personas" className="form-label small text-uppercase text-muted">Cantidad de Personas</label>
                    <input type="number" id="personas" name="personas" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" min="1" max="12" value={form.personas} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fecha" className="form-label small text-uppercase text-muted">Fecha del evento</label>
                    <input type="date" id="fecha" name="fecha" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" value={form.fecha} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="hora" className="form-label small text-uppercase text-muted">Hora de llegada</label>
                    <input type="time" id="hora" name="hora" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" value={form.hora} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="comentarios" className="form-label small text-uppercase text-muted">Requerimientos Especiales (Opcional)</label>
                    <textarea id="comentarios" name="comentarios" rows="3" className="form-control bg-black bg-opacity-40 text-white border-secondary border-opacity-50" placeholder="Ej. Mesa en zona de fumadores, alergias, celebraciones de cumpleaños..." value={form.comentarios} onChange={handleChange}></textarea>
                  </div>
                  
                  <div className="col-12 my-2">
                    {mensaje && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success small mb-0">✨ {mensaje}</div>}
                    {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small mb-0">⚠️ {error}</div>}
                  </div>
                  
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-warning text-dark fw-bold px-4 py-2" disabled={isSubmitting}>
                      {isSubmitting ? 'Procesando...' : 'Confirmar y Reservar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>


          <div className="card shadow-sm border-secondary border-opacity-25 rounded-4 bg-dark text-white">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 border-bottom border-secondary border-opacity-15 pb-2">
                <h3 className="h5 fw-bold text-white mb-0">
                  <i className="bi bi-map text-warning me-2"></i>Plano del Restaurante
                </h3>
                <span className={`badge ${mesaSeleccionada ? 'bg-warning text-dark' : 'bg-secondary text-muted'} px-3 py-2 fw-bold`}>
                  {mesaSeleccionada ? `Mesa Elegida: ${mesaSeleccionada}` : 'Ninguna mesa seleccionada'}
                </span>
              </div>
              
              <p className="text-muted small mb-3">
                {horarioSeleccionado
                  ? isLoadingOcupadas
                    ? 'Sincronizando estado con el servidor de Mestrax...'
                    : `Disponemos de ${mesasDisponibles.length} mesas libres para el bloque seleccionado.`
                  : 'Completa la fecha y hora arriba para liberar el mapa interactivo en tiempo real.'}
              </p>
              
              <div className="mesa-legend d-flex gap-3 flex-wrap mb-4 small bg-black bg-opacity-20 p-2 rounded border border-secondary border-opacity-10">
                <span className="d-flex align-items-center gap-2"><i className="mesa-dot libre bg-success d-inline-block rounded-circle" style={{ width: '10px', height: '10px' }}></i>Disponible</span>
                <span className="d-flex align-items-center gap-2"><i className="mesa-dot ocupada bg-danger d-inline-block rounded-circle" style={{ width: '10px', height: '10px' }}></i>Ocupada</span>
                <span className="d-flex align-items-center gap-2"><i className="mesa-dot bloqueada bg-secondary d-inline-block rounded-circle" style={{ width: '10px', height: '10px' }}></i>Bloqueado</span>
              </div>


              <div className="restaurante-layout position-relative w-100 rounded-3 overflow-hidden border border-secondary border-opacity-20 bg-black bg-opacity-40" style={{ height: '360px' }}>
                <div className="entrada border border-secondary text-muted position-absolute bg-dark p-2 text-center border-opacity-25" style={{ bottom: '0', left: '42%', width: '16%', fontSize: '0.8rem', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}><span>Entrada</span></div>
                
                <div className="area-principal w-100 h-100 position-absolute">
                  {POSICIONES_MESAS.map((mesa) => {
                    const ocupada = mesasOcupadas.includes(mesa.id);
                    const seleccionada = mesaSeleccionada === mesa.id;
                    const sinHorario = !horarioSeleccionado;
                    const bloqueada = ocupada || sinHorario || isLoadingOcupadas;
                    const estadoMesa = ocupada ? 'reservada' : bloqueada ? 'sin horario' : 'disponible';

                    let colorClase = 'btn-outline-success';
                    if (ocupada) colorClase = 'btn-danger opacity-75';
                    else if (sinHorario) colorClase = 'btn-outline-secondary opacity-25';
                    else if (seleccionada) colorClase = 'btn-warning text-dark fw-bold shadow';

                    return (
                      <button
                        key={mesa.id}
                        type="button"
                        className={`btn btn-sm rounded-circle position-absolute d-flex align-items-center justify-content-center p-0 ${colorClase}`}
                        style={{ top: mesa.top, left: mesa.left, width: '40px', height: '40px', transition: 'all 0.2s' }}
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
                
                <div className="barra bg-dark border border-secondary border-opacity-25 text-muted text-center p-1 position-absolute" style={{ top: '10%', right: '0', width: '50px', height: '120px', writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '0.8rem' }}><span>Barra</span></div>
                <div className="cocina bg-dark border border-secondary border-opacity-25 text-muted text-center p-1 position-absolute" style={{ top: '50%', right: '0', width: '50px', height: '120px', writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '0.8rem' }}><span>Cocina</span></div>
              </div>
              
              <p className="mt-3 text-muted small mb-0">💡 Consejo: Selecciona primero el horario para habilitar el croquis. Haz clic sobre el número de mesa verde iluminado para apartar tu lugar en la sala.</p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}