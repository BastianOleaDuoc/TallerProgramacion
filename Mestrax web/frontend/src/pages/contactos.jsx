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

    const formData = new FormData(form);
    const datos = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      mensaje: formData.get('mensaje'),
    };
    
    console.log("Datos de contacto listos:", datos);

    setMensaje('¡Mensaje enviado con éxito! Te responderemos a la brevedad.');
    form.reset();

    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <main className="container py-5 page-shell">
      <div className="text-center mb-4">
        <span className="soft-badge">Atención personalizada</span>
        <h2 className="fw-bold mt-3 mb-2 text-white">Contáctanos</h2>
        <p className="text-center text-muted mb-4">
          ¿Tienes dudas, reclamos o sugerencias? Escríbenos.
        </p>
      </div>
      
      <section className="card glass-panel p-4 mx-auto bg-dark text-white border-secondary border-opacity-25" style={{ maxWidth: '640px' }}>
        <form id="contactForm" onSubmit={handleSubmit} noValidate={false}>
          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted">Nombre</label>
            <input type="text" name="nombre" className="form-control bg-black text-white border-secondary" placeholder="Tu nombre completo" required />
          </div>
          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted">Correo Electrónico</label>
            <input type="email" name="email" className="form-control bg-black text-white border-secondary" placeholder="correo@mestrax.com" required />
          </div>
          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted">Teléfono</label>
            <input type="text" name="telefono" className="form-control bg-black text-white border-secondary" placeholder="+56 9 1234 5678" required />
          </div>
          <div className="mb-3">
            <label className="form-label small text-uppercase text-muted">Mensaje</label>
            <textarea name="mensaje" rows="4" className="form-control bg-black text-white border-secondary" placeholder="Escribe tu mensaje o sugerencia aquí..." required></textarea>
          </div>
          
          {mensaje && <div className="alert alert-success py-2 border-0 bg-success bg-opacity-25 text-success mb-3">{mensaje}</div>}
          
          <button type="submit" className="btn btn-warning text-dark w-100 fw-bold py-2">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}