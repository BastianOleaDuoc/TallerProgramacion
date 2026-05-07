function iniciarRegistro(){

const form = document.getElementById("registroForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const nombre = document.getElementById("nombre").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const confirmPassword = document.getElementById("confirmPassword").value.trim();

// Validar que todos los campos estén completos
if(nombre === "" || email === "" || password === "" || confirmPassword === ""){
alert("Completa todos los campos");
return;
}

// Validar que el nombre tenga al menos 3 caracteres
if(nombre.length < 3){
alert("El nombre debe tener al menos 3 caracteres");
return;
}

// Validar que la contraseña tenga al menos 6 caracteres
if(password.length < 6){
alert("La contraseña debe tener al menos 6 caracteres");
return;
}

// Validar que las contraseñas coincidan
if(password !== confirmPassword){
alert("Las contraseñas no coinciden");
return;
}

// Obtener usuarios existentes
let usuarios = JSON.parse(localStorage.getItem("usuariosMestrax")) || [];

// Validar que no exista un usuario con ese email
if(usuarios.find(u => u.email === email)){
alert("El correo electrónico ya está registrado");
return;
}

// Crear nuevo usuario
const nuevoUsuario = {
nombre: nombre,
email: email,
password: password,
fechaRegistro: new Date().toISOString()
};

// Guardar el nuevo usuario
usuarios.push(nuevoUsuario);
localStorage.setItem("usuariosMestrax", JSON.stringify(usuarios));

// Establecer el usuario activo
localStorage.setItem("usuarioActivo", email);

alert("¡Bienvenido a Mestrax! Tu cuenta ha sido creada exitosamente.");

// Redirigir al perfil
window.location.href = "perfil.html";

});

}
