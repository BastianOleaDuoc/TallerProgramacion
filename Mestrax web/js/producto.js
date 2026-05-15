const PRODUCTOS = [

{ id:1, name:"Mycelium Burger", category:"Hamburguesas", price:11990, img:"../img/mycelium.jpg"},
{ id:2, name:"Klask Burger", category:"Hamburguesas", price:10900, img:"../img/klask.png"},
{ id:3, name:"Ameri Burger", category:"Hamburguesas", price:10900, img:"../img/ameri.png"},
{ id:4, name:"Blood BBQ Rage", category:"Hamburguesas", price:10900, img:"../img/blood.png"},

{ id:5, name:"Aros de Cebolla", category:"Entradas", price:6400, img:"../img/aros.png"},
{ id:6, name:"Chao Pescao", category:"Entradas", price:9500, img:"../img/chao.png"},
{ id:7, name:"Empanadas Camarón", category:"Entradas", price:8900, img:"../img/camaron.png"},
{ id:8, name:"Empanadas Mechada", category:"Entradas", price:6900, img:"../img/mechada.png"},

{ id:9, name:"Paleo Rustica", category:"Chorrillanas", price:14900, img:"../img/rustica.png"},
{ id:10, name:"Everdell", category:"Chorrillanas", price:14900, img:"../img/everdel.png"},
{ id:11, name:"Mojate el Pollito", category:"Chorrillanas", price:14900, img:"../img/pollo.png"},

{ id:12, name:"Cosmonopoly", category:"Tragos", price:6990, img:"../img/cosmo.png"},
{ id:13, name:"Bola de Fuego", category:"Tragos", price:8490, img:"../img/bolafuego.png"},
{ id:14, name:"Whiskey Tiki", category:"Tragos", price:8490, img:"../img/tiki.png"},
{ id:15, name:"Margarita", category:"Tragos", price:6990, img:"../img/margarita.png"},
{ id:16, name:"Negroni", category:"Tragos", price:7490, img:"../img/negroni.png"},

{ id:17, name:"Rhino Hero", category:"Mocktails", price:7490, img:"../img/rhino.png"},
{ id:18, name:"Virus", category:"Mocktails", price:6490, img:"../img/virus.png"},
{ id:19, name:"Fantasma Blitz", category:"Mocktails", price:6990, img:"../img/fantasma.png"},

{ id:20, name:"Cafe Latte", category:"Cafeteria", price:4490, img:"../img/latte.png"},
{ id:21, name:"Capuccino", category:"Cafeteria", price:3990, img:"../img/cappuccino.png"},
{ id:22, name:"Chocolate Premium", category:"Cafeteria", price:5490, img:"../img/chocolate.png"},

{ id:23, name:"Brownie con Helado", category:"Postres", price:7900, img:"../img/brownie.png"},
{ id:24, name:"Copa de Helado", category:"Postres", price:4500, img:"../img/copahelado.png"},
{ id:25, name:"Celestino con Helado", category:"Postres", price:6900, img:"../img/celestino.png"}

];

function dinero(valor){
  return "$" + valor.toLocaleString("es-CL");
}

function mostrar(lista){

const grid = document.getElementById("grid");

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

const cat = document.getElementById("categoria").value;
const txt = document.getElementById("buscar").value.toLowerCase();

let lista = PRODUCTOS;

if(cat != "Todas"){
lista = lista.filter(p => p.category == cat);
}

if(txt != ""){
lista = lista.filter(p => p.name.toLowerCase().includes(txt));
}

mostrar(lista);

}

function agregar(id){

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const prod = PRODUCTOS.find(p => p.id == id);

carrito.push(prod);

localStorage.setItem("carrito", JSON.stringify(carrito));

document.getElementById("cart-count").textContent = carrito.length;

alert(prod.name + " agregado");

}

document.getElementById("categoria").addEventListener("change", filtrar);
document.getElementById("buscar").addEventListener("input", filtrar);

mostrar(PRODUCTOS);

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
document.getElementById("cart-count").textContent = carrito.length;