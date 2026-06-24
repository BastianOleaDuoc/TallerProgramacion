let PRODUCTOS = [];

function dinero(valor){
  return "$" + valor.toLocaleString("es-CL");
}

function mostrar(lista){
  const grid = document.getElementById("grid");
  if(!grid) return;
  
  grid.innerHTML = lista.map(p => `
    <div class="col-md-4 col-lg-3 mb-4">
      <div class="card h-100">
        <img src="${p.img}" class="card-img-top rounded-top" onerror="this.src='../img/default.png'" alt="${p.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold text-white">${p.name}</h5>
          <p class="card-text text-muted small">${p.category}</p>
          <p class="card-text fw-bold mt-auto fs-5" style="color: #60a5fa;">${dinero(p.price)}</p>
          <button class="btn-primary-modern w-100 mt-2 fw-bold" onclick="agregar(${p.id})">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function filtrar(){
  const catElem = document.getElementById("categoria");
  const busElem = document.getElementById("buscar");
  if(!catElem || !busElem) return;

  const cat = catElem.value;
  const txt = busElem.value.toLowerCase();

  let lista = PRODUCTOS;
  if(cat !== "Todas") lista = lista.filter(p => p.category === cat);
  if(txt !== "") lista = lista.filter(p => p.name.toLowerCase().includes(txt));
  
  mostrar(lista);
}

function agregar(id){
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const prod = PRODUCTOS.find(p => p.id === id);

  if(prod) {
    carrito.push(prod);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    const cartCount = document.getElementById("cart-count");
    if(cartCount) cartCount.textContent = carrito.length;

    Swal.fire({
      title: '¡Producto Agregado!',
      text: `${prod.name} ya está en tu carrito`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      background: '#000000', 
      color: '#fff',
      backdrop: `rgba(0,0,0,0.4)` 
    });
  }
} 

// esta es  una nueva funcion q traer los productos reales desde PHP}
async function cargarProductosDesdeBD() {
  try {
    const respuesta = await fetch("http://localhost/mestrax/backend/productos/obtener_productos.php");
    const resultado = await respuesta.json();

    if (resultado.status === "success") {
      PRODUCTOS = resultado.data; 
      mostrar(PRODUCTOS);         
    } else {
      console.error("Error del servidor:", resultado.message);
    }
  } catch (error) {
    console.error("Error de conexión al cargar el catálogo:", error);
  }
}


// inicializacion (Actualizado para llamar a la Base de Datos)

document.addEventListener("DOMContentLoaded", () => {
  const selectCat = document.getElementById("categoria");
  const inputBus = document.getElementById("buscar");

  if(selectCat) selectCat.addEventListener("change", filtrar);
  if(inputBus) inputBus.addEventListener("input", filtrar);


  cargarProductosDesdeBD();


  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cartCount = document.getElementById("cart-count");
  if(cartCount) cartCount.textContent = carrito.length;
});