document.addEventListener("DOMContentLoaded", function() {

    const adminEmail = localStorage.getItem("adminActivo");
  
    if (!adminEmail) {
        alert("Acceso denegado. Por favor, inicie sesión como administrador.");
        window.location.href = "loginAdmin.html";
        return;
    }
  
    const emailSpan = document.getElementById("adminEmail");
    if (emailSpan) {
        emailSpan.textContent = adminEmail;
    }

    setTimeout(() => {
        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            cartCountEl.textContent = carrito.length;
        }
    }, 150);

    configurarFormularioProducto();
    cargarMetricasDashboard(); 
});
  
function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("adminActivo");
        window.location.href = "loginAdmin.html";
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

    if (vistaId === 'productos') {
        listarProductosAdmin();
    }
    
    if (vistaId === 'reservas') {
        listarReservasAdmin();
    }

    if (vistaId === 'ventas') {
        listarVentasAdmin();
    }
}

async function cargarMetricasDashboard() {
    const txtVentas = document.getElementById("dashVentasHoy");
    const txtReservas = document.getElementById("dashReservasActivas");
    const txtProductos = document.getElementById("dashProductosTotales");
    
    const repEstrella = document.getElementById("repProductoEstrella");
    const repEstrellaVentas = document.getElementById("repProductoVentas");

    const adminEmail = localStorage.getItem("adminActivo");

    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/admin/obtener_dashboard.php", {
            method: "GET",
            headers: {
                "X-Admin-Email": adminEmail
            }
        });
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const datos = resultado.datos;

            if (txtVentas) {
                txtVentas.textContent = `$${parseFloat(datos.ventas_hoy).toLocaleString('es-CL')}`;
            }

            if (txtReservas) {
                txtReservas.textContent = `${datos.reservas_activas} Mesas`;
            }

            if (txtProductos) {
                txtProductos.textContent = `${datos.productos_totales} Ítems`;
            }

            if (repEstrella) {
                repEstrella.textContent = datos.producto_estrella;
            }
            if (repEstrellaVentas) {
                repEstrellaVentas.textContent = `${datos.cantidad_estrella} unidades vendidas`;
            }

        } else {
            console.error("Error devuelto por el servidor:", resultado.message);
            marcarDashboardError();
        }

    } catch (error) {
        console.error("Error crítico de conexión al cargar el Dashboard:", error);
        marcarDashboardError();
    }
}

function marcarDashboardError() {
    if (document.getElementById("dashVentasHoy")) document.getElementById("dashVentasHoy").textContent = "$ --";
    if (document.getElementById("dashReservasActivas")) document.getElementById("dashReservasActivas").textContent = "-- Mesas";
    if (document.getElementById("dashProductosTotales")) document.getElementById("dashProductosTotales").textContent = "-- Ítems";
    if (document.getElementById("repProductoEstrella")) document.getElementById("repProductoEstrella").textContent = "Error de datos";
}

async function listarProductosAdmin() {
    const tablaCuerpo = document.querySelector("#productosView tbody");
    if (!tablaCuerpo) return;

    const adminEmail = localStorage.getItem("adminActivo");

    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/productos/obtener_productos.php", {
            method: "GET",
            headers: {
                "X-Admin-Email": adminEmail
            }
        });
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const listaProductos = resultado.data;
            tablaCuerpo.innerHTML = "";

            if (listaProductos.length === 0) {
                tablaCuerpo.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No hay productos registrados en la base de datos.</td></tr>`;
                return;
            }

            listaProductos.forEach((prod, index) => {
                tablaCuerpo.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img src="${prod.img}" alt="${prod.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='../img/default.png'">
                        </td>
                        <td>
                            <div class="fw-bold text-white">${prod.name}</div>
                            <small class="text-secondary d-block text-truncate" style="max-width: 250px;">
                                ${prod.description || 'Sin descripción'}
                            </small>
                        </td>
                        <td><span class="badge bg-secondary">${prod.category}</span></td>
                        <td class="text-end text-warning fw-bold">$${prod.price.toLocaleString('es-CL')}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-warning me-2" onclick="abrirModalEditar(${prod.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${prod.id}, '${prod.name}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Error al obtener productos para el admin:", error);
    }
}

function abrirModalCrear() {
    document.getElementById("modalProductoLabel").textContent = "➕ Agregar Nuevo Producto";
    document.getElementById("formProducto").reset();
    document.getElementById("prod_id").value = ""; 
    document.getElementById("edit-img-help").classList.add("d-none");
    document.getElementById("prod_imagen").required = true; 

    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

async function abrirModalEditar(id) {
    const adminEmail = localStorage.getItem("adminActivo");
    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/productos/obtener_productos.php", {
            method: "GET",
            headers: { "X-Admin-Email": adminEmail }
        });
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const prod = resultado.data.find(p => p.id === id);
            
            if (!prod) {
                Swal.fire('Error', 'No se encontró la información del producto.', 'error');
                return;
            }

            document.getElementById("modalProductoLabel").textContent = "✏️ Editar Producto";
            document.getElementById("prod_id").value = prod.id;
            document.getElementById("prod_nombre").value = prod.name;
            document.getElementById("prod_categoria").value = prod.category;
            document.getElementById("prod_precio").value = prod.price;
            document.getElementById("prod_stock").value = prod.stock || 20;
            document.getElementById("prod_descripcion").value = prod.description || "";
            document.getElementById("prod_imagen").value = ""; 
            
            document.getElementById("edit-img-help").classList.remove("d-none");
            document.getElementById("prod_imagen").required = false; 

            const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
            modal.show();
        }
    } catch (error) {
        console.error("Error al cargar datos en el formulario:", error);
        Swal.fire('Error', 'No se pudieron recuperar los datos del servidor.', 'error');
    }
}

function configurarFormularioProducto() {
    const form = document.getElementById("formProducto");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("prod_id").value;
        const urlBackend = id 
            ? "http://localhost/mestrax/backend/productos/editar_producto.php" 
            : "http://localhost/mestrax/backend/productos/crear_producto.php";

        const datosFormulario = new FormData(form);
        const adminEmail = localStorage.getItem("adminActivo");

        try {
            const respuesta = await fetch(urlBackend, {
                method: "POST",
                headers: {
                    "X-Admin-Email": adminEmail
                },
                body: datosFormulario
            });
            const resultado = await respuesta.json();

            if (resultado.status === "success") {
                const modalElement = document.getElementById('modalProducto');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                Swal.fire({
                    title: '¡Operación Exitosa!',
                    text: resultado.message,
                    icon: 'success',
                    background: '#000',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });

                listarProductosAdmin();
                cargarMetricasDashboard(); 
            } else {
                Swal.fire('Error', resultado.message, 'error');
            }
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
            Swal.fire('Error', 'Problema de conexión con el servidor.', 'error');
        }
    });
}

function eliminarProducto(id, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar "${nombre}" permanentemente del menú.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#000',
        color: '#fff'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const datos = new FormData();
                datos.append('id', id);
                const adminEmail = localStorage.getItem("adminActivo");

                const respuesta = await fetch("http://localhost/mestrax/backend/productos/eliminar_producto.php", {
                    method: 'POST',
                    headers: {
                        "X-Admin-Email": adminEmail
                    },
                    body: datos
                });
                
                const resultado = await respuesta.json();

                if (resultado.status === "success") {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: resultado.message,
                        icon: 'success',
                        background: '#000',
                        color: '#fff',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    listarProductosAdmin();
                    cargarMetricasDashboard(); 
                } else {
                    Swal.fire('Error', resultado.message, 'error');
                }
            } catch (error) {
                console.error("Error al conectar con el backend de eliminación:", error);
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        }
    });
}

async function listarReservasAdmin() {
    const tablaCuerpo = document.querySelector("#reservasView tbody");
    if (!tablaCuerpo) return;

    const adminEmail = localStorage.getItem("adminActivo");

    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/reservas/obtener_reservas.php", {
            method: "GET",
            headers: { "X-Admin-Email": adminEmail }
        });
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const listaReservas = resultado.data;
            tablaCuerpo.innerHTML = ""; 

            if (listaReservas.length === 0) {
                tablaCuerpo.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay reservas agendadas en la base de datos.</td></tr>`;
                return;
            }

            listaReservas.forEach(res => {
                let badgeColor = "bg-warning text-dark"; 
                if (res.estado === "Confirmada") badgeColor = "bg-success";
                if (res.estado === "Cancelada") badgeColor = "bg-danger";

                tablaCuerpo.innerHTML += `
                    <tr>
                        <td class="fw-bold text-warning">#${res.mesa}</td>
                        <td>${res.cliente}</td>
                        <td>${res.fecha_hora}</td>
                        <td class="text-center">
                            <span class="badge bg-secondary px-3">${res.personas} pers.</span>
                        </td>
                        <td class="text-center">
                            <span class="badge ${badgeColor} me-2">${res.estado}</span>
                            <button class="btn btn-sm btn-outline-info" onclick="verDetallesReserva('${res.detalles}')">
                                Ver Detalles
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Error al obtener reservas para el admin:", error);
    }
}

function verDetallesReserva(detalles) {
    Swal.fire({
        title: 'Observaciones de la Reserva',
        text: detalles,
        icon: 'info',
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#ffc107',
        confirmButtonText: 'Entendido'
    });
}

// =========================================================
// 🔒 FUNCIÓN OPTIMIZADA: SIN ERRORES DE SINTAXIS NI COMILLAS
// =========================================================
async function listarVentasAdmin() {
    const tablaCuerpo = document.getElementById("tablaVentasCuerpo");
    if (!tablaCuerpo) return;

    const adminEmail = localStorage.getItem("adminActivo");

    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/ventas/obtener_ventas.php", {
            method: "GET",
            headers: {
                "X-Admin-Email": adminEmail 
            }
        });
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const listaVentas = resultado.data;
            tablaCuerpo.innerHTML = "";

            if (!listaVentas || listaVentas.length === 0) {
                tablaCuerpo.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay ventas registradas en la base de datos.</td></tr>`;
                return;
            }

            listaVentas.forEach(venta => {
                // 🛠️ Extraemos variables limpias para evitar escapar comillas en el bloque HTML literal
                const pagoMetodo = venta.metodo_pago || 'No especificado';
                const estadoVenta = venta.estado || 'Completado';

                tablaCuerpo.innerHTML += `
                    <tr>
                        <td class="fw-bold text-warning">#${venta.id_venta}</td>
                        <td>${venta.fecha_hora}</td>
                        <td class="text-end text-success fw-bold">$${parseFloat(venta.total).toLocaleString('es-CL')}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-primary" onclick="Swal.fire({title: 'Detalle', text: 'Método: ${pagoMetodo} | Estado: ${estadoVenta}', icon: 'info', background: '#000', color: '#fff'})">
                                Ver Boleta
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tablaCuerpo.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Error: ${resultado.message}</td></tr>`;
        }
    } catch (error) {
        console.error("Error al obtener el historial de ventas:", error);
        tablaCuerpo.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">No se pudo establecer comunicación con el servidor.</td></tr>`;
    }
}