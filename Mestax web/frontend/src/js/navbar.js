
export function actualizarNavbar() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const usuarioLink = document.getElementById("usuarioLink");

    if (!usuarioLink) return;

    if (usuarioActivo) {

        usuarioLink.href = "./perfil.html";
        usuarioLink.textContent = "Mi Perfil"; 
    } else {

        usuarioLink.href = "./login.html";
        usuarioLink.textContent = "Login";
    }
}


document.addEventListener("DOMContentLoaded", actualizarNavbar);