function iniciarRegistro() {
  const form = document.getElementById("registroForm"); 
  if (!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("regNombre").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value.trim();

    if (email === "" || pass === "") {
      alert("El correo y la contraseña son obligatorios");
      return;
    }

    try {

      const response = await fetch("http://localhost:8080/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre || "Cliente",
          email: email,
          password: pass
        })
      });

      const datos = await response.json();

      if (!response.ok) {
        alert(datos.message || "Error al registrar el usuario");
        return;
      }

      alert("¡Usuario registrado con éxito en la base de datos! Ahora puedes iniciar sesión.");
      window.location.href = "login.html"; 

    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error al conectar con el servidor.");
    }
  });
}