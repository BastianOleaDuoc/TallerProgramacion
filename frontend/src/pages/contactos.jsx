import { useState } from 'react';

export default function Contactos() {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setMensaje('Mensaje enviado. Te responderemos a la brevedad.');
    form.reset();
  };

  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Atencion personalizada</span>
        <h2 className="fw-bold mt-3 mb-2">Contactanos</h2>
        <p className="text-center text-muted mb-4">
          Tienes dudas, reservas o sugerencias? Escribenos.
        </p>
      </div>
      <section className="card glass-panel p-4 mx-auto" style={{ maxWidth: '640px' }}>
        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" id="nombre" className="form-control" placeholder="Tu nombre" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="email" id="email" className="form-control" placeholder="correo@mestrax.com" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefono</label>
            <input type="text" id="telefono" className="form-control" placeholder="+56 9 1234 5678" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje</label>
            <textarea id="mensaje" rows="4" className="form-control" placeholder="Escribe tu mensaje" required></textarea>
          </div>
          {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
          <button type="submit" className="btn btn-dark w-100">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}
