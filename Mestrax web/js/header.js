const path = window.location.pathname;
const currentPage = path.split("/").pop() || "index.html";

function getActive(page) {
  if ((currentPage === "" || currentPage === "/") && page === "index.html") return "active";
  return currentPage === page ? "active" : "";
}

let adminLink = `<a href="./loginAdmin.html" class="${getActive('loginAdmin.html')}"><i class="bi bi-gear me-1"></i>Admin</a>`;
let adminBadge = ``;

if (currentPage === "admin_panel.html") {
  adminLink = `<a href="./admin_panel.html" class="active"><i class="bi bi-shield-lock me-1"></i>Panel</a>`;
  adminBadge = `<span class="fs-6 text-danger ms-2 fw-bold">ADMIN</span>`;
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
      <a href="./login.html" class="${getActive('login.html')}"><i class="bi bi-person me-1"></i>Usuario</a>
      ${adminLink}
    </nav>
  </div>
</header>
`);

// Lógica para ocultar/mostrar el header al hacer scroll
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;
  
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  if (currentScroll > lastScrollTop && currentScroll > 80) {
    // Si baja más de 80px, oculta el header
    header.classList.add("header-hidden");
  } else {
    // Si sube, muestra el header
    header.classList.remove("header-hidden");
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});