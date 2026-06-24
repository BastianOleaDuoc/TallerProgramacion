function dinero(n){
  return "$" + Number(n || 0).toLocaleString("es-CL");
}

function obtenerCarrito(){
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(lista){
  localStorage.setItem("carrito", JSON.stringify(lista));
}

function mostrarCarrito(){
  let carrito = obtenerCarrito();
  const cartCount = document.getElementById("cart-count");
  

  if(cartCount) {
    cartCount.textContent = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  }

  const empty = document.getElementById("empty");
  const wrap = document.getElementById("cartWrap");
  const tbody = document.getElementById("tbody");

  if(carrito.length === 0){
    if(empty) empty.classList.remove("d-none");
    if(wrap) wrap.classList.add("d-none");
    return;
  }

  if(empty) empty.classList.add("d-none");
  if(wrap) wrap.classList.remove("d-none");

  let html = "";
  let total = 0;

  carrito.forEach((p, i) => {
    const precioUnitario = Number(p.precio || p.price || 0);
    const nombreProducto = p.nombre || p.name || "Producto";
    const cantidad = Number(p.cantidad || 1);
    const subtotal = precioUnitario * cantidad; 
    
    total += subtotal;

    html += `
    <tr>
      <td>${nombreProducto}</td>
      <td class="text-end">${dinero(precioUnitario)}</td>
      <td class="text-end">${cantidad}</td>
      <td class="text-end">${dinero(subtotal)}</td>
      <td>
        <button onclick="eliminar(${i})" class="btn btn-sm btn-danger">X</button>
      </td>
    </tr>
    `;
  });

  if(tbody) tbody.innerHTML = html;
  const totalElem = document.getElementById("total");
  if(totalElem) totalElem.textContent = dinero(total);
}

function eliminar(i){
  let carrito = obtenerCarrito();
  carrito.splice(i, 1);
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


  const total = carrito.reduce((acc, p) => acc + (Number(p.precio || p.price || 0) * Number(p.cantidad || 1)), 0);
  

  const resumen = carrito.map((p) => `${p.cantidad || 1}x ${p.nombre || p.name}`).join(', ');

  try {
    const response = await fetch("http://localhost:8080/api/ventas", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: 'Cliente invitado',
        producto: resumen,
        total: total,
        metodo: 'Efectivo', 
        estado: 'Pagada',
      }),
    });

    if (!response.ok) throw new Error();

    alert("Pago realizado correctamente y registrado en el sistema");
    localStorage.removeItem("carrito");
    window.location.href = "/"; 
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor de Java. Se realizara un pago local simulado.");
    localStorage.removeItem("carrito");
    window.location.href = "/"; 
  }
}