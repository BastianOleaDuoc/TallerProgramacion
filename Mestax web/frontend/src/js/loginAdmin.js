
const API_BASE = "https://nube-nz47.onrender.com/api";

/**
 *
 * @param {string} endpoint 
 * @param {Object} credenciale
 */
async function realizarLogin(endpoint, credenciales) {
    try {

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credenciales)
        });

        if (!response.ok) throw new Error("Credenciales incorrectas");

        return await response.json();
    } catch (error) {
        console.error("Error de conexión:", error);
        throw error;
    }
}


export async function iniciarLoginAdmin(e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const pass = document.getElementById("password")?.value.trim();

    if (!email || !pass) return alert("Completa todos los campos");

    try {
        const admin = await realizarLogin("/admin/login", { email, password: pass });
        localStorage.setItem("adminActivo", admin.email);
        alert("Bienvenido Administrador");
        window.location.href = "admin_panel.html";
    } catch {
        alert("Error: Credenciales de administrador incorrectas o servidor caído.");
    }
}


export async function iniciarLoginUsuario(e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const pass = document.getElementById("password")?.value.trim();

    if (!email || !pass) return alert("Completa todos los campos");

    try {
        const user = await realizarLogin("/usuario/login", { email, password: pass });
        localStorage.setItem("usuarioActivo", user.email);
        alert("¡Bienvenido a Mestrax!");
        window.location.href = "perfil.html";
    } catch {
        alert("Error: Correo o contraseña incorrectos.");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("adminForm");
    const loginForm = document.getElementById("loginForm");

    if (adminForm) adminForm.addEventListener("submit", iniciarLoginAdmin);
    if (loginForm) loginForm.addEventListener("submit", iniciarLoginUsuario);
});