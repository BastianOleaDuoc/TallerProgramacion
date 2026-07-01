
export function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

export function guardarCarrito(lista) {
    localStorage.setItem("carrito", JSON.stringify(lista));
}

export function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const tbody = document.getElementById("tbody");
    const empty = document.getElementById("empty");
    const wrap = document.getElementById("cartWrap");
    const totalEl = document.getElementById("total");

    if (!tbody) return;

    if (carrito.length === 0) {
        if (empty) empty.classList.remove("d-none");
        if (wrap) wrap.classList.add("d-none");
        return;
    }

    if (empty) empty.classList.add("d-none");
    if (wrap) wrap.classList.remove("d-none");

    let total = 0;
    tbody.innerHTML = carrito.map((p, i) => {
        const nombre = p.nombre || p.name || "Producto";
        const precio = Number(p.precio || p.price || 0);
        const cantidad = Number(p.cantidad || 1);
        const subtotal = precio * cantidad;
        total += subtotal;

        return `
            <tr>
                <td>${nombre}</td>
                <td class="text-end">$${precio.toLocaleString('es-CL')}</td>
                <td class="text-end">${cantidad}</td>
                <td class="text-end">$${subtotal.toLocaleString('es-CL')}</td>
                <td class="text-end">
                    <button onclick="eliminarDelCarrito(${i})" class="btn btn-sm btn-danger">X</button>
                </td>
            </tr>
        `;
    }).join("");

    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
}


export function eliminarDelCarrito(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

export function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

export function pagar() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    alert("Pago realizado correctamente");
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
}


window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.pagar = pagar;

document.addEventListener("DOMContentLoaded", mostrarCarrito);