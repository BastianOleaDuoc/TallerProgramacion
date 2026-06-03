function iniciarLogin(){

const form = document.getElementById("loginForm");

form.addEventListener("submit", async function(e){

e.preventDefault();

const email = document.getElementById("email").value.trim();
const pass = document.getElementById("password").value.trim();

if(email === "" || pass === ""){
    alert("Completa todos los campos");
    return;
}

const datos = new FormData();

datos.append("email", email);
datos.append("password", pass);

try{

    const respuesta = await fetch(
        "http://localhost/mestrax/backend/auth/login.php",
        {
            method: "POST",
            body: datos
        }
    );

    const resultado = await respuesta.text();

    if(resultado === "Login correcto"){

        localStorage.setItem("usuarioActivo", email);

        alert("Bienvenido a Mestrax");

        window.location.href = "perfil.html";

    }else{

        alert(resultado);

    }

}catch(error){

    console.error(error);
    alert("Error al conectar con el servidor");

}

});

}