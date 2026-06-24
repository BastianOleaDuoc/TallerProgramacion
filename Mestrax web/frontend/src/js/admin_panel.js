document.addEventListener("DOMContentLoaded", function() {
    const adminEmail = localStorage.getItem("adminActivo");

    if (!adminEmail) {
        Swal.fire({
            title: 'Acceso Denegado',
            text: 'Por favor, inicie sesión como administrador.',
            icon: 'error',
            background: '#000',
            color: '#fff'
        }).then(() => {
            window.location.href = "loginAdmin.html"; 
        });
        return;
    }

    const emailSpan = document.getElementById("adminEmail");
    if (emailSpan) {
        emailSpan.textContent = adminEmail;
    }

    cargarDatosDashboard();
});

async function cargarDatosDashboard() {
    try {
        const respuesta = await fetch("http://localhost:8080/api/dashboard");
        if (!respuesta.ok) throw new Error("No se pudieron cargar las métricas");

        const datos = await respuesta.json();

        if(document.getElementById("cantProductosActivos")) {
            document.getElementById("cantProductosActivos").textContent = datos.productosActivos;
        }
        if(document.getElementById("cantReservasHoy")) {
            document.getElementById("cantReservasHoy").textContent = datos.reservasHoy;
        }
        if(document.getElementById("montoTotalVentas")) {
            document.getElementById("montoTotalVentas").textContent = `$${datos.totalVentas.toLocaleString('es-CL')}`;
        }

    } catch (error) {
        console.error("Error al conectar con el Dashboard de Java:", error);
    }
}

function cerrarSesion() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar tu sesión de administrador?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        background: '#000',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("adminActivo"); 
            window.location.href = "loginAdmin.html"; 
        }
    });
}

function mostrarVista(vistaId) {
    const vistas = ['dashboardView', 'productosView', 'reservasView', 'reportesView', 'ventasView'];
    
    let targetId = vistaId;
    if (!vistaId.endsWith('View')) {
        targetId = vistaId + 'View';
    }

    vistas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === targetId) {
                el.classList.remove('d-none');
            } else {
                el.classList.add('d-none');
            }
        }
    });

    if (targetId === 'dashboardView') cargarDatosDashboard();
    if (targetId === 'productosView' && typeof listarProductosAdmin === 'function') listarProductosAdmin();
    if (targetId === 'reservasView' && typeof listarReservasAdmin === 'function') listarReservasAdmin();
    if (targetId === 'ventasView' && typeof listarVentasAdmin === 'function') listarVentasAdmin();
}