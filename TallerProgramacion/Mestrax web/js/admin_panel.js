function cargarAdminPanel(){

const adminActivo = localStorage.getItem("adminActivo");

// Si no hay admin activo, redirigir a login
if(!adminActivo){
alert("Debes iniciar sesión como administrador");
window.location.href = "loginAdmin.html";
return;
}

// Mostrar email del admin
document.getElementById("adminEmail").textContent = adminActivo;

// Logout
document.getElementById("logoutAdmin").addEventListener("click", function(){
if(confirm("¿Estás seguro de que deseas cerrar sesión?")){
localStorage.removeItem("adminActivo");
alert("Sesión cerrada exitosamente");
window.location.href = "loginAdmin.html";
}
});

// Cargar datos del dashboard
let usuarios = JSON.parse(localStorage.getItem("usuariosMestrax")) || [];
let productos = JSON.parse(localStorage.getItem("productosMestrax")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidosMestrax")) || [];

document.getElementById("countProductos").textContent = productos.length;
document.getElementById("countUsuarios").textContent = usuarios.length;
document.getElementById("countPedidos").textContent = pedidos.length;

// Cargar tabla de usuarios
const tablaUsuarios = document.getElementById("tablaUsuarios");
tablaUsuarios.innerHTML = usuarios.map(u => `
<tr>
<td>${u.email}</td>
<td>${u.nombre}</td>
<td>Cliente</td>
<td><button class="btn btn-sm btn-warning">Editar</button></td>
</tr>
`).join("");

// Cargar tabla de productos
const tablaProductos = document.getElementById("tablaProductos");
if(productos.length > 0){
tablaProductos.innerHTML = productos.map(p => `
<tr>
<td>${p.nombre}</td>
<td>${p.categoria}</td>
<td class="text-end">$${p.precio}</td>
<td class="text-end">${p.stock || 0}</td>
<td><button class="btn btn-sm btn-warning">Editar</button></td>
</tr>
`).join("");
} else {
tablaProductos.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay productos registrados</td></tr>`;
}

// Cargar tabla de pedidos
const tablaPedidos = document.getElementById("tablaPedidos");
if(pedidos.length > 0){
tablaPedidos.innerHTML = pedidos.map(ped => `
<tr>
<td>${ped.id}</td>
<td>${ped.cliente}</td>
<td>${new Date(ped.fecha).toLocaleDateString('es-ES')}</td>
<td>$${ped.total}</td>
<td><button class="btn btn-sm btn-info">Ver</button></td>
</tr>
`).join("");
} else {
tablaPedidos.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay pedidos registrados</td></tr>`;
}

// Navegación de secciones
document.querySelectorAll("#adminTabs button").forEach(btn => {
btn.addEventListener("click", function(){
const section = this.dataset.section;

// Remover clase active de todos
document.querySelectorAll("#adminTabs button").forEach(b => b.classList.remove("active"));
this.classList.add("active");

// Ocultar todas las secciones
document.querySelectorAll(".admin-section").forEach(s => s.classList.add("d-none"));

// Mostrar sección seleccionada
document.getElementById(`section-${section}`).classList.remove("d-none");
});
});

}
