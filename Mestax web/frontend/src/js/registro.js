
const API_BASE = "https://nube-nz47.onrender.com/api";

/**
 * 
 * @param {Object} datos
 * @returns {Promise<Object>} 
 */
export async function registrarUsuario(datos) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: datos.nombre,
                email: datos.email,
                password: datos.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
  
            throw new Error(data.mensaje || "Error al registrar usuario en el servidor");
        }

        localStorage.setItem("usuarioActivo", data.email);
        return { success: true, usuario: data };

    } catch (error) {
        console.error("Error en registro.js:", error);
        return { success: false, message: error.message };
    }
}


export function validarRegistro(form) {
    if (!form.nombre.trim() || !form.email.trim() || !form.password) {
        return "Completa todos los campos";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
        return "Correo electrónico inválido";
    }
    if (form.password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres";
    }
    if (form.password !== form.confirmPassword) {
        return "Las contraseñas no coinciden";
    }
    return null; 
}