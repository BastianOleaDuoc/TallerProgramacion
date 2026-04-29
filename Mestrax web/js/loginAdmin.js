function iniciarLoginAdmin(){

const form = document.getElementById("adminForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("email").value.trim();
const pass = document.getElementById("password").value.trim();

if(email === "" || pass === ""){
alert("Completa todos los campos");
return;
}

const admins = [

{ email:"admin@mestrax.com", password:"admin123" },
{ email:"soporte@mestrax.com", password:"mestrax2026" }

];

const admin = admins.find(a => a.email === email && a.password === pass);

if(!admin){
alert("Credenciales incorrectas");
return;
}

localStorage.setItem("adminActivo", email);

alert("Bienvenido Administrador");

window.location.href = "admin_panel.html";

});

}