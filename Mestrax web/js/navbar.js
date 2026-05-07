function actualizarNavbar(){

const usuarioActivo = localStorage.getItem("usuarioActivo");
const usuarioLink = document.getElementById("usuarioLink");

if(usuarioLink){
if(usuarioActivo){
// Usuario logueado - mostrar link al perfil
usuarioLink.href = "./perfil.html";
usuarioLink.textContent = "Usuario";
} else {
// Usuario no logueado - mostrar link al login
usuarioLink.href = "./login.html";
usuarioLink.textContent = "Usuario";
}
}

}
