// carrito.js

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

function pagar(){

let carrito = obtenerCarrito();

if(carrito.length === 0){
alert("Tu carrito está vacío");
return;
}

alert("Pago realizado correctamente");

localStorage.removeItem("carrito");

window.location.href = "index.html";

}