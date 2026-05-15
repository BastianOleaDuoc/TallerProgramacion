document.addEventListener("DOMContentLoaded", function() {
    // 1. Verificamos si existe la sesión del administrador en localStorage
    const adminEmail = localStorage.getItem("adminActivo");
  
    // 2. Si no hay un correo guardado, significa que intentaron entrar sin hacer login
    if (!adminEmail) {
      alert("Acceso denegado. Por favor, inicie sesión como administrador.");
      window.location.href = "loginAdmin.html"; // Lo devolvemos al login
      return;
    }
  
    // 3. Si todo está correcto, mostramos su correo en la pantalla
    const emailSpan = document.getElementById("adminEmail");
    if (emailSpan) {
      emailSpan.textContent = adminEmail;
    }
  });
  
  function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("adminActivo"); // Borramos la sesión
      window.location.href = "loginAdmin.html"; // Redirigimos al login
    }
  }

  function mostrarVista(vistaId) {
    const vistas = ['dashboardView', 'productosView', 'reservasView', 'reportesView', 'ventasView'];
    
    vistas.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === vistaId + 'View') {
          el.classList.remove('d-none');
        } else {
          el.classList.add('d-none');
        }
      }
    });
  }