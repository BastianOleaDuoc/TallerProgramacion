function cargarPerfil(){

  const usuarioActivo = localStorage.getItem("usuarioActivo"); 
  const usuarioNombre = localStorage.getItem("usuarioNombre"); 


  if(!usuarioActivo){
    alert("Debes iniciar sesión para acceder a tu perfil");
    window.location.href = "/login";
    return;
  }

  const perfilContent = document.getElementById("perfilContent");
  if (!perfilContent) return;


  const fechaRegistro = new Date().toLocaleDateString('es-CL');

  perfilContent.innerHTML = `
    <div class="mb-4">
      <h3 class="fw-bold text-white">Información Personal</h3>
    </div>

    <div class="mb-3">
      <label class="form-label text-white">Nombre</label>
      <p class="fw-bold text-white">${usuarioNombre || "Cliente Mestrax"}</p>
    </div>

    <div class="mb-3">
      <label class="form-label text-white">Correo electrónico</label>
      <p class="fw-bold text-white">${usuarioActivo}</p>
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

  document.getElementById("cerrarSesionBtn").addEventListener("click", function(){
    if(confirm("¿Estás seguro de que deseas cerrar sesión?")){
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("usuarioNombre");
      localStorage.removeItem("usuarioId");
      
      alert("Sesión cerrada exitosamente");
      window.location.href = "/"; 
    }
  });

  document.getElementById("editarPerfilBtn").addEventListener("click", function(){
    alert("Función de edición próximamente disponible");
  });
}