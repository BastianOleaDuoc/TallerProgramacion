function iniciarLoginAdmin() {
    const form = document.getElementById("adminForm");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value;

        if (email === "" || pass === "") {
            alert("Completa todos los campos");
            return;
        }

        const datos = new FormData();
        datos.append("email", email);
        datos.append("password", pass);

        try {
            const respuesta = await fetch("http://localhost/mestrax/backend/auth/loginAdmin.php", {
                method: "POST",
                body: datos
            });

            const resultado = await respuesta.text();

            if (resultado.trim() === "Login admin correcto") {
                // 1. Guardamos firmemente la sesión en el navegador
                localStorage.setItem("adminActivo", email);
                
                alert("Bienvenido Administrador");
                
                // 2. Redirección relativa limpia. 
                // Como loginAdmin.html y admin_panel.html están en la misma carpeta (frontend/html/), 
                // solo necesitamos llamarlo directamente sin carpetas intermedias:
                window.location.replace("admin_panel.html"); 
            } else {
                alert("Credenciales incorrectas o usuario no autorizado");
            }

        } catch (error) {
            console.error("Error en el login administrativo:", error);
            alert("Error de conexión con el servidor de seguridad.");
        }
    });
}