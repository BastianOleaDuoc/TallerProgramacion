document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos todos los enlaces de la página
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = this.getAttribute('target');
      
      // Verificamos que sea un enlace interno válido y no abra en otra pestaña
      if (
        href && 
        !href.startsWith('#') && 
        !href.startsWith('javascript:') && 
        target !== '_blank' &&
        this.hostname === window.location.hostname
      ) {
        e.preventDefault(); // Detenemos la navegación instantánea
        const targetUrl = this.href;

        // Añadimos la clase para que inicie la animación de salida
        document.body.classList.add('page-exit');

        // Esperamos a que termine la animación (0.35s) para cambiar de página
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 350); 
      }
    });
  });
});