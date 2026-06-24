function iniciarRegistro(){
  const form = document.getElementById("registroForm");

  if (!form) {
    return; 
  }

  form.addEventListener("submit", async function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();


    if(nombre === "" || email === "" || password === "" || confirmPassword === ""){
      alert("Completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      alert("Por favor, ingresa un correo electrónico válido");
      return;
    }

    if(nombre.length < 3){
      alert("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if(password.length < 6){
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if(password !== confirmPassword){
      alert("Las contraseñas no coinciden");
      return;
    }

    try {

      const response = await fetch("http://localhost:8080/api/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          password: password
        })
      });

      const datos = await response.json();


      if (!response.ok) {
        alert(datos.message || "El correo electrónico ya está registrado");
        return;
      }

      localStorage.setItem("usuarioActivo", datos.email);
      localStorage.setItem("usuarioNombre", datos.nombre);
      localStorage.setItem("usuarioId", datos.id);

      alert("¡Bienvenido a Mestrax! Tu cuenta ha sido creada exitosamente.");


      window.location.href = "/perfil";

    } catch (error) {
      console.error("Error al conectar con el backend de registro:", error);
      alert("Error al conectar con el servidor. Por favor, intenta más tarde.");
    }
  });
}