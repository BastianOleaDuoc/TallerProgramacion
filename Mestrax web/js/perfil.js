function cargarPerfil(){

const usuarioActivo = localStorage.getItem("usuarioActivo");

// Si no hay usuario activo, redirigir a login
if(!usuarioActivo){
alert("Debes iniciar sesión para acceder a tu perfil");
window.location.href = "login.html";
return;
}

// Obtener los datos del usuario
let usuarios = JSON.parse(localStorage.getItem("usuariosMestrax")) || [];
const usuario = usuarios.find(u => u.email === usuarioActivo);

if(!usuario){
alert("Usuario no encontrado");
window.location.href = "login.html";
return;
}

// Mostrar los datos del usuario
const perfilContent = document.getElementById("perfilContent");

const fechaRegistro = new Date(usuario.fechaRegistro).toLocaleDateString('es-ES');

perfilContent.innerHTML = `
<div class="mb-4">
<h3 class="fw-bold text-white">Información Personal</h3>
</div>

<div class="mb-3">
<label class="form-label text-white">Nombre</label>
<p class="fw-bold text-white">${usuario.nombre}</p>
</div>

<div class="mb-3">
<label class="form-label text-white">Correo electrónico</label>
<p class="fw-bold text-white">${usuario.email}</p>
</div>

<div class="mb-4">
<label class="form-label text-white">Miembro desde</label>
<p class="fw-bold text-white">${fechaRegistro}</p>
</div>

<button id="cerrarSesionBtn" class="btn btn-dark w-100 mb-2">
Cerrar sesión
</button>

<button id="editarPerfilBtn" class="btn btn-secondary w-100">
Editar perfil
</button>
`;

// Event listeners
document.getElementById("cerrarSesionBtn").addEventListener("click", function(){
if(confirm("¿Estás seguro de que deseas cerrar sesión?")){
localStorage.removeItem("usuarioActivo");
alert("Sesión cerrada exitosamente");
window.location.href = "index.html";
}
});

document.getElementById("editarPerfilBtn").addEventListener("click", function(){
alert("Función de edición próximamente disponible");
});

}
