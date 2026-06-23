function actualizarNavbar(){
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const usuarioLink = document.getElementById("usuarioLink");

  if(usuarioLink){
    if(usuarioActivo){
      usuarioLink.href = "/perfil";
    } else {
      usuarioLink.href = "/login";
    }
  }
}