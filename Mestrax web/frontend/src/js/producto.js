let PRODUCTOS_SISTEMA = [];

function dinero(valor){
  return "$" + Number(valor || 0).toLocaleString("es-CL");
}

function normalizarTexto(valor = '') {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function resolverImagenProducto(nombre) {
  const mapeo = {
    myceliumburger: 'mycelium.jpg',
    klaskburger: 'klask.png',
    ameriburger: 'ameri.png',
    bloodbbqrage: 'blood.png',
    arosdecebolla: 'aros.png',
    chaopescao: 'chao.png',
    empanadascamaron: 'camaron.png',
    empanadasmechada: 'mechada.png',
    paleorustica: 'rustica.png',
    everdell: 'everdel.png',
    mojateelpollito: 'pollo.png',
    cosmonopoly: 'cosmo.png',
    boladefuego: 'bolafuego.png',
    whiskeytiki: 'tiki.png',
    margarita: 'margarita.png',
    negroni: 'negroni.png',
    rhinohero: 'rhino.png',
    virus: 'virus.png',
    fantasmablitz: 'fantasma.png',
    cafelatte: 'latte.png',
    capuccino: 'cappuccino.png',
    cappuccino: 'cappuccino.png',
    chocolatepremium: 'chocolate.png',
    brownieconhelado: 'brownie.png',
    copadehelado: 'copahelado.png',
    celestinoconhelado: 'celestino.png'
  };
  const key = mapeo[normalizarTexto(nombre)];
  return key ? `../img/${key}` : '../img/unnamed.png';
}

async function cargarProductosDesdeJava() {
  try {
    const respuesta = await fetch("http://localhost:8080/api/productos");
    if (!respuesta.ok) throw new Error("Error en red");
    const datos = await respuesta.json();
    PRODUCTOS_SISTEMA = datos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      img: resolverImagenProducto(p.nombre)
    }));
    mostrar(PRODUCTOS_SISTEMA);
  } catch (error) {
    console.error("Usando productos de respaldo local:", error);
    PRODUCTOS_SISTEMA = [
      { id: 1, nombre: 'Mycelium Burger', categoria: 'Hamburguesas', precio: 11990, img: '../img/mycelium.jpg' },
      { id: 2, nombre: 'Klask Burger', categoria: 'Hamburguesas', precio: 10900, img: '../img/klask.png' },
      { id: 3, nombre: 'Ameri Burger', categoria: 'Hamburguesas', precio: 10900, img: '../img/ameri.png' },
      { id: 4, nombre: 'Blood BBQ Rage', categoria: 'Hamburguesas', precio: 10900, img: '../img/blood.png' },
      { id: 5, nombre: 'Aros de Cebolla', categoria: 'Entradas', precio: 6400, img: '../img/aros.png' },
      { id: 6, nombre: 'Chao Pescao', categoria: 'Entradas', precio: 9500, img: '../img/chao.png' },
      { id: 7, nombre: 'Empanadas Camarón', categoria: 'Entradas', precio: 8900, img: '../img/camaron.png' },
      { id: 8, nombre: 'Empanadas Mechada', categoria: 'Entradas', precio: 6900, img: '../img/mechada.png' },
      { id: 9, nombre: 'Paleo Rustica', categoria: 'Chorrillanas', precio: 14900, img: '../img/rustica.png' },
      { id: 10, nombre: 'Everdell', categoria: 'Chorrillanas', precio: 14900, img: '../img/everdel.png' },
      { id: 11, nombre: 'Mojate el Pollito', categoria: 'Chorrillanas', precio: 14900, img: '../img/pollo.png' },
      { id: 12, nombre: 'Cosmonopoly', categoria: 'Tragos', precio: 6990, img: '../img/cosmo.png' },
      { id: 13, nombre: 'Bola de Fuego', categoria: 'Tragos', precio: 8490, img: '../img/bolafuego.png' },
      { id: 14, nombre: 'Whiskey Tiki', categoria: 'Tragos', precio: 8490, img: '../img/tiki.png' },
      { id: 15, nombre: 'Margarita', categoria: 'Tragos', precio: 6990, img: '../img/margarita.png' },
      { id: 16, nombre: 'Negroni', categoria: 'Tragos', precio: 7490, img: '../img/negroni.png' },
      { id: 17, nombre: 'Rhino Hero', categoria: 'Mocktails', precio: 7490, img: '../img/rhino.png' },
      { id: 18, nombre: 'Virus', categoria: 'Mocktails', precio: 6490, img: '../img/virus.png' },
      { id: 19, nombre: 'Fantasma Blitz', categoria: 'Mocktails', precio: 6990, img: '../img/fantasma.png' },
      { id: 20, nombre: 'Cafe Latte', categoria: 'Cafeteria', precio: 4490, img: '../img/latte.png' },
      { id: 21, nombre: 'Capuccino', categoria: 'Cafeteria', precio: 3990, img: '../img/cappuccino.png' },
      { id: 22, nombre: 'Chocolate Premium', categoria: 'Cafeteria', precio: 5490, img: '../img/chocolate.png' },
      { id: 23, nombre: 'Brownie con Helado', categoria: 'Postres', precio: 7900, img: '../img/brownie.png' },
      { id: 24, nombre: 'Copa de Helado', categoria: 'Postres', precio: 4500, img: '../img/copahelado.png' },
      { id: 25, nombre: 'Celestino con Helado', categoria: 'Postres', precio: 6900, img: '../img/celestino.png' }
    ];
    mostrar(PRODUCTOS_SISTEMA);
  }
}

function mostrar(lista){
  const grid = document.getElementById("grid");
  if(!grid) return;
  
  grid.innerHTML = lista.map(p => `
    <div class="col-md-4 col-lg-3 mb-4">
      <div class="card h-100">
        <img src="${p.img}" class="card-img-top rounded-top" onerror="this.src='../img/default.png'" alt="${p.nombre}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold text-white">${p.nombre}</h5>
          <p class="card-text text-muted small">${p.categoria}</p>
          <p class="card-text fw-bold mt-auto fs-5" style="color: #60a5fa;">${dinero(p.precio)}</p>
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

  let lista = PRODUCTOS_SISTEMA;
  if(cat !== "Todas") lista = lista.filter(p => p.categoria === cat);
  if(txt !== "") lista = lista.filter(p => p.nombre.toLowerCase().includes(txt));
  
  mostrar(lista);
}

function agregar(id){
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const prod = PRODUCTOS_SISTEMA.find(p => p.id === id);

  if(prod) {
    const index = carrito.findIndex(p => p.id === id);
    if(index !== -1) {
      carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    } else {
      carrito.push({ ...prod, cantidad: 1 });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));

    const cartCount = document.getElementById("cart-count");
    if(cartCount) cartCount.textContent = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: '¡Producto Agregado!',
        text: `${prod.nombre} ya está en tu carrito`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#000000', 
        color: '#fff',
        backdrop: `rgba(0,0,0,0.4)` 
      });
    } else {
      alert(`¡Producto Agregado!\n${prod.nombre} ya está en tu carrito`);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const selectCat = document.getElementById("categoria");
  const inputBus = document.getElementById("buscar");

  if(selectCat) selectCat.addEventListener("change", filtrar);
  if(inputBus) inputBus.addEventListener("input", filtrar);

  cargarProductosDesdeJava();

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cartCount = document.getElementById("cart-count");
  if(cartCount) cartCount.textContent = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
});