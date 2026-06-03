async function cargarPerfil() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para acceder a tu perfil");
        window.location.href = "login.html";
        return;
    }

    const datos = new FormData();
    datos.append("email", usuarioActivo);

    try {
        const respuesta = await fetch("http://localhost/mestrax/backend/auth/perfil.php", {
            method: "POST",
            body: datos
        });

        const textoRespuesta = await respuesta.text();
        
        let usuario;
        try {
            usuario = JSON.parse(textoRespuesta);
        } catch (e) {
            console.error("El backend no devolvió un JSON válido. Respuesta recibida:", textoRespuesta);
            alert("Error interno del servidor al procesar los datos del perfil.");
            return;
        }

        if (usuario.status === "error" || !usuario) {
            alert(usuario.message || "Usuario no encontrado en el sistema");
            window.location.href = "login.html";
            return;
        }

        const perfilContent = document.getElementById("perfilContent");

        const fechaRegistro = usuario.fechaRegistro 
            ? new Date(usuario.fechaRegistro).toLocaleDateString('es-ES') 
            : "No disponible";

        perfilContent.innerHTML = `
            <div class="mb-4">
                <h3 class="fw-bold text-white">Información Personal</h3>
            </div>

            <div class="mb-3">
                <label class="form-label text-secondary">Nombre</label>
                <p class="fw-bold text-white fs-5">${usuario.nombre}</p>
            </div>

            <div class="mb-3">
                <label class="form-label text-secondary">Correo electrónico</label>
                <p class="fw-bold text-white fs-5">${usuario.email}</p>
            </div>

            <div class="mb-4">
                <label class="form-label text-secondary">Miembro desde</label>
                <p class="fw-bold text-white fs-5">${fechaRegistro}</p>
            </div>

            <button id="cerrarSesionBtn" class="btn btn-danger w-100 mb-2">
                Cerrar sesión
            </button>

            <button id="editarPerfilBtn" class="btn btn-secondary w-100">
                Editar perfil
            </button>
        `;

        document.getElementById("cerrarSesionBtn").addEventListener("click", function() {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                localStorage.removeItem("usuarioActivo");
                alert("Sesión cerrada exitosamente");
                window.location.href = "index.html";
            }
        });

        document.getElementById("editarPerfilBtn").addEventListener("click", function() {
            alert("Función de edición próximamente disponible");
        });


        cargarHistorialVentas(usuario.email);

    } catch (error) {
        console.error("Error crítico en la petición Fetch:", error);
        alert("Error de conexión al cargar los datos del perfil.");
    }
}


async function cargarHistorialVentas(email) {
    const contenedor = document.getElementById("contenedorHistorial");
    if (!contenedor) return; 

    try {

        const respuesta = await fetch(`http://localhost/mestrax/backend/ventas/obtener_ventas.php?email=${encodeURIComponent(email)}`);
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const compras = resultado.historial;


            if (!compras || compras.length === 0) {
                contenedor.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted py-4">
                            <i class="bi bi-cart-x fs-3 d-block mb-2 text-secondary"></i>Aún no has realizado ninguna compra.
                        </td>
                    </tr>`;
                return;
            }

            contenedor.innerHTML = "";


            compras.forEach(compra => {
                const fila = document.createElement("tr");


                const fechaFormateada = new Date(compra.fecha_venta).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });


                let badgeColor = "bg-success"; 
                if (compra.estado.toLowerCase() === "pendiente") badgeColor = "bg-warning text-dark";
                if (compra.estado.toLowerCase() === "cancelado" || compra.estado.toLowerCase() === "cancelada") badgeColor = "bg-danger";

                fila.innerHTML = `
                    <td><strong>#${compra.id}</strong></td>
                    <td class="text-nowrap">${fechaFormateada}</td>
                    <td><div style="max-width: 200px;" class="text-truncate" title="${compra.detalles_productos}">${compra.detalles_productos}</div></td>
                    <td class="text-warning fw-bold">$${parseFloat(compra.total).toLocaleString('es-CL')}</td>
                    <td><span class="badge bg-secondary">${compra.metodo_pago}</span></td>
                    <td><span class="badge ${badgeColor}">${compra.estado}</span></td>
                `;

                contenedor.appendChild(fila);
            });

        } else {

            contenedor.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-3">Error: ${resultado.message}</td></tr>`;
        }

    } catch (error) {
        console.error("Error al conectar con obtener_ventas.php:", error);
        contenedor.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-3"><i class="bi bi-exclaim-triangle me-2"></i>Error al conectar con el historial de compras.</td></tr>`;
    }
}