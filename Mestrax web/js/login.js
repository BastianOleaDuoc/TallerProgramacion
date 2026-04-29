function iniciarLogin(){

const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("email").value.trim();
const pass = document.getElementById("password").value.trim();

if(email === "" || pass === ""){
alert("Completa todos los campos");
return;
}

let usuarios = JSON.parse(localStorage.getItem("usuariosMestrax")) || [];

const user = usuarios.find(u => u.email === email && u.password === pass);

if(!user){
alert("Correo o contraseña incorrectos");
return;
}

localStorage.setItem("usuarioActivo", email);

alert("Bienvenido a Mestrax");

window.location.href = "index.html";

});

}