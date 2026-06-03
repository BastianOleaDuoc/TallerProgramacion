function dinero(n){
    return "$" + n.toLocaleString("es-CL");
}

function obtenerCarrito(){
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(lista){
    localStorage.setItem("carrito", JSON.stringify(lista));
}

function mostrarCarrito(){
    let carrito = obtenerCarrito();

    document.getElementById("cart-count").textContent = carrito.length;

    const empty = document.getElementById("empty");
    const wrap = document.getElementById("cartWrap");
    const tbody = document.getElementById("tbody");

    if(carrito.length === 0){
        empty.classList.remove("d-none");
        wrap.classList.add("d-none");
        return;
    }

    empty.classList.add("d-none");
    wrap.classList.remove("d-none");

    let html = "";
    let total = 0;

    carrito.forEach((p,i)=>{
        total += p.price;

        html += `
        <tr>
            <td>${p.name}</td>
            <td class="text-end">${dinero(p.price)}</td>
            <td class="text-end">1</td>
            <td class="text-end">${dinero(p.price)}</td>
            <td>
                <button onclick="eliminar(${i})" class="btn btn-sm btn-danger">
                    X
                </button>
            </td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
    document.getElementById("total").textContent = dinero(total);
}

function eliminar(i){
    let carrito = obtenerCarrito();
    carrito.splice(i,1);
    guardarCarrito(carrito);
    mostrarCarrito();
}

function vaciarCarrito(){
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

async function pagar(){
    let carrito = obtenerCarrito();

    if(carrito.length === 0){
        alert("Tu carrito está vacío");
        return;
    }


    const totalCompra = carrito.reduce((acumulado, p) => acumulado + p.price, 0);


    const datosVenta = {
        total: totalCompra,
        productos: carrito
    };

    try {

        const respuesta = await fetch("http://localhost/mestrax/backend/ventas/guardar_venta.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosVenta)
        });

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            alert("¡Pago realizado correctamente! Venta registrada.");
            

            localStorage.removeItem("carrito");
            

            window.location.href = "index.html";
        } else {
            alert("Hubo un problema al procesar el cobro: " + resultado.message);
        }

    } catch (error) {
        console.error("Error crítico en la comunicación con el servidor:", error);
        alert("No se pudo establecer conexión con el sistema de ventas del servidor.");
    }
}