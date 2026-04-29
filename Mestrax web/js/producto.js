const PRODUCTOS = [

{ id:1, name:"Mycelium Burger", category:"Hamburguesas", price:11990, img:"../img/burger.png"},
{ id:2, name:"Klask Burger", category:"Hamburguesas", price:10900, img:"../img/burger.png"},
{ id:3, name:"Ameri Burger", category:"Hamburguesas", price:10900, img:"../img/burger.png"},
{ id:4, name:"Blood BBQ Rage", category:"Hamburguesas", price:10900, img:"../img/burger.png"},

{ id:5, name:"Aros de Cebolla", category:"Entradas", price:6400, img:"../img/onion.png"},
{ id:6, name:"Chao Pescao", category:"Entradas", price:9500, img:"../img/fish.png"},
{ id:7, name:"Empanadas Camarón", category:"Entradas", price:8900, img:"../img/empanada.png"},
{ id:8, name:"Empanadas Mechada", category:"Entradas", price:6900, img:"../img/empanada.png"},

{ id:9, name:"Paleo Rustica", category:"Chorrillanas", price:14900, img:"../img/fries.png"},
{ id:10, name:"Everdell", category:"Chorrillanas", price:14900, img:"../img/fries.png"},
{ id:11, name:"Mojate el Pollito", category:"Chorrillanas", price:14900, img:"../img/fries.png"},

{ id:12, name:"Cosmonopoly", category:"Tragos", price:6990, img:"../img/drink.png"},
{ id:13, name:"Bola de Fuego", category:"Tragos", price:8490, img:"../img/drink.png"},
{ id:14, name:"Whiskey Tiki", category:"Tragos", price:8490, img:"../img/drink.png"},
{ id:15, name:"Margarita", category:"Tragos", price:6990, img:"../img/drink.png"},
{ id:16, name:"Negroni", category:"Tragos", price:7490, img:"../img/drink.png"},

{ id:17, name:"Rhino Hero", category:"Mocktails", price:7490, img:"../img/mocktail.png"},
{ id:18, name:"Virus", category:"Mocktails", price:6490, img:"../img/mocktail.png"},
{ id:19, name:"Fantasma Blitz", category:"Mocktails", price:6990, img:"../img/mocktail.png"},

{ id:20, name:"Cafe Latte", category:"Cafeteria", price:4490, img:"../img/coffee.png"},
{ id:21, name:"Capuccino", category:"Cafeteria", price:3990, img:"../img/coffee.png"},
{ id:22, name:"Chocolate Premium", category:"Cafeteria", price:5490, img:"../img/coffee.png"},

{ id:23, name:"Brownie con Helado", category:"Postres", price:7900, img:"../img/cake.png"},
{ id:24, name:"Copa de Helado", category:"Postres", price:4500, img:"../img/cake.png"},
{ id:25, name:"Celestino con Helado", category:"Postres", price:6900, img:"../img/cake.png"}

];

function dinero(valor){
  return "$" + valor.toLocaleString("es-CL");
}

function mostrar(lista){

const grid = document.getElementById("grid");

grid.innerHTML = lista.map(p => `
<div class="card">

<img src="${p.img}" onerror="this.src='../img/default.png'">

<h3>${p.name}</h3>
<p>${p.category}</p>
<span>${dinero(p.price)}</span>

<button onclick="agregar(${p.id})">
Agregar
</button>

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