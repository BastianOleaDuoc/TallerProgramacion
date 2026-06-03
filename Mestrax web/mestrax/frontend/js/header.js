const path = window.location.pathname;
const currentPage = path.split("/").pop() || "index.html";

function getActive(page) {
  if ((currentPage === "" || currentPage === "/") && page === "index.html") return "active";
  return currentPage === page ? "active" : "";
}


const usuarioActivo = localStorage.getItem("usuarioActivo");
const adminActivo = localStorage.getItem("adminActivo"); 

let adminLink = `<a href="./loginAdmin.html" class="${getActive('loginAdmin.html')}"><i class="bi bi-gear me-1"></i>Admin</a>`;
let adminBadge = ``;

if (currentPage === "admin_panel.html") {
  adminLink = `<a href="./admin_panel.html" class="active"><i class="bi bi-shield-lock me-1"></i>Panel</a>`;
  adminBadge = `<span class="fs-6 text-danger ms-2 fw-bold">ADMIN</span>`;
}

let botonUsuario = `<a href="./login.html" class="${getActive('login.html')}"><i class="bi bi-person me-1"></i>Usuario</a>`;

if (usuarioActivo) {

  botonUsuario = `<a href="./perfil.html" class="${getActive('perfil.html')}"><i class="bi bi-person-check-fill me-1 text-warning"></i>Mi Perfil</a>`;
}

document.write(`
<header>
  <div class="container">
    <h1 class="m-0 d-flex align-items-center gap-2">
      <a href="./index.html" class="d-flex align-items-center text-decoration-none">
        <img src="../img/unnamed.png" alt="Mestrax Logo" style="height: 180px; width: 180px; border-radius: 50%; object-fit: cover;">
        ${adminBadge}
      </a>
    </h1>
    <nav>
      <a href="./index.html" class="${getActive('index.html')}"><i class="bi bi-house me-1"></i>Inicio</a>
      <a href="./producto.html" class="${getActive('producto.html')}"><i class="bi bi-shop me-1"></i>Productos</a>
      <a href="./carrito.html" class="${getActive('carrito.html')}"><i class="bi bi-cart me-1"></i>Carrito <span id="cart-count" class="badge bg-danger">0</span></a>
      <a href="./reserva.html" class="${getActive('reserva.html')}"><i class="bi bi-calendar-check me-1"></i>Reserva</a>
      <a href="./contactos.html" class="${getActive('contactos.html')}"><i class="bi bi-telephone me-1"></i>Contacto</a>
      ${botonUsuario}
      ${adminLink}
    </nav>
  </div>
</header>
`);


document.addEventListener("DOMContentLoaded", () => {
  try {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
      cartCountEl.textContent = carrito.length;
    }
  } catch (e) {
    console.error("Error al leer el carrito:", e);
  }
});


let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop && currentScroll > 80) {
    header.classList.add("header-hidden");
  } else {
    header.classList.remove("header-hidden");
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});