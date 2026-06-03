function iniciarRegistro() {

const form = document.getElementById("registroForm");

form.addEventListener("submit", async function(e) {

e.preventDefault();

const nombre = document.getElementById("nombre").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const confirmPassword = document.getElementById("confirmPassword").value.trim();

if(nombre === "" || email === "" || password === "" || confirmPassword === ""){
    alert("Completa todos los campos");
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

const datos = new FormData();

datos.append("nombre", nombre);
datos.append("email", email);
datos.append("password", password);

try {
    alert("Voy a enviar");
    const respuesta = await fetch(
    "http://localhost/mestrax/backend/auth/registro.php",
    {
        method: "POST",
        body: datos
    }
    );
    alert("Respuesta recibida");
    const resultado = await respuesta.text();

    alert(resultado);

    if(resultado.includes("correctamente")){
        window.location.href = "login.html";
    }

} catch(error){

    console.error(error);
    alert("Error al conectar con el servidor");

}

});

}