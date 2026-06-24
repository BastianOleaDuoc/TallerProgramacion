function iniciarLoginAdmin(){
  const form = document.getElementById("adminForm");
  if (!form) return;

  form.addEventListener("submit", async function(e){
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    if(email === "" || pass === ""){
      alert("Completa todos los campos");
      return;
    }

    try {

      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pass
        })
      });

      const datos = await response.json();

      if (!response.ok) {
        alert(datos.message || "Credenciales incorrectas");
        return;
      }


      if (datos.rol !== "ADMIN" && email !== "admin@mestrax.com") { 
        alert("Acceso denegado: No tienes permisos de administrador.");
        return;
      }


      localStorage.setItem("adminActivo", datos.email);

      alert("Bienvenido Administrador");

      window.location.href = "/admin_panel";

    } catch (error) {
      console.error("Error al conectar con el backend de administración:", error);
      alert("Error al conectar con el servidor de Java.");
    }
  });
}