

const API_BASE = "https://nube-nz47.onrender.com/api";

export async function obtenerDatosPerfil(email) {
    try {

        const response = await fetch(`${API_BASE}/usuarios/buscar?email=${email}`);
        if (!response.ok) throw new Error("Error en servidor");
        return await response.json();
    } catch (error) {
        console.error("Fallo al obtener perfil:", error);
        return null;
    }
}

export function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "/";
}


document.addEventListener("DOMContentLoaded", async () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (!usuarioActivo) return;

    const datos = await obtenerDatosPerfil(usuarioActivo);
    if (datos) {

        const nombreEl = document.getElementById("nombreUsuario");
        if (nombreEl) nombreEl.textContent = datos.nombre;
    }
});