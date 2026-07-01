
document.addEventListener("DOMContentLoaded", () => {
    const adminEmail = localStorage.getItem("adminActivo");
    const emailSpan = document.getElementById("adminEmail");

    if (!adminEmail) {
        alert("Acceso denegado. Por favor, inicie sesión como administrador.");
        window.location.href = "loginAdmin.html";
        return;
    }

    if (emailSpan) {
        emailSpan.textContent = adminEmail;
    }
});

export function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("adminActivo");
        window.location.href = "loginAdmin.html";
    }
}

/**
 * 
 * @param {string} vistaId 
 */
export function mostrarVista(vistaId) {
    const vistas = ['dashboardView', 'productosView', 'reservasView', 'reportesView', 'ventasView'];
  
    const vistaObjetivo = vistaId.endsWith('View') ? vistaId : `${vistaId}View`;

    vistas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          
            el.classList.toggle('d-none', id !== vistaObjetivo);
        }
    });
}


window.cerrarSesion = cerrarSesion;
window.mostrarVista = mostrarVista;