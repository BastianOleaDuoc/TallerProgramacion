document.addEventListener('DOMContentLoaded', function() {
  const reservaForm = document.getElementById('reservaForm');
  const areaPrincipal = document.querySelector('.area-principal');
  const mesaSeleccionadaInput = document.getElementById('mesaSeleccionada');

  let mesaSeleccionada = null;

  // Posiciones de mesas (simulando un layout realista)
  const posicionesMesas = [
    { id: 1, top: '10%', left: '10%' },
    { id: 2, top: '10%', left: '30%' },
    { id: 3, top: '10%', left: '50%' },
    { id: 4, top: '10%', left: '70%' },
    { id: 5, top: '30%', left: '10%' },
    { id: 6, top: '30%', left: '30%' },
    { id: 7, top: '30%', left: '50%' },
    { id: 8, top: '30%', left: '70%' },
    { id: 9, top: '50%', left: '20%' },
    { id: 10, top: '50%', left: '40%' },
    { id: 11, top: '50%', left: '60%' },
    { id: 12, top: '70%', left: '15%' },
    { id: 13, top: '70%', left: '35%' },
    { id: 14, top: '70%', left: '55%' },
    { id: 15, top: '70%', left: '75%' }
  ];

  // Mesas ocupadas (ejemplo)
  const mesasOcupadas = [5, 10, 14];

  // Generar mesas
  function generarMesas() {
    areaPrincipal.innerHTML = '';
    posicionesMesas.forEach(pos => {
      const mesaDiv = document.createElement('div');
      mesaDiv.className = 'mesa';
      mesaDiv.textContent = pos.id;
      mesaDiv.style.position = 'absolute';
      mesaDiv.style.top = pos.top;
      mesaDiv.style.left = pos.left;

      if (mesasOcupadas.includes(pos.id)) {
        mesaDiv.classList.add('ocupada');
      } else {
        mesaDiv.classList.add('libre');
        mesaDiv.addEventListener('click', () => seleccionarMesa(pos.id, mesaDiv));
      }

      areaPrincipal.appendChild(mesaDiv);
    });
  }

  function seleccionarMesa(numero, elemento) {
    // Deseleccionar mesa anterior
    if (mesaSeleccionada) {
      const mesaAnterior = document.querySelector('.mesa.seleccionada');
      if (mesaAnterior) {
        mesaAnterior.classList.remove('seleccionada');
        mesaAnterior.classList.add('libre');
      }
    }

    // Seleccionar nueva mesa
    elemento.classList.remove('libre');
    elemento.classList.add('seleccionada');
    mesaSeleccionada = numero;
    mesaSeleccionadaInput.value = numero;

    // mostrarRuta(numero); // Quitado por solicitud del usuario
  }

  function mostrarRuta(mesaId) {
    // Simular ruta: desde entrada hasta mesa
    const rutas = {
      1: 'Desde la entrada, ve recto hacia adelante.',
      2: 'Desde la entrada, ve recto y gira a la izquierda.',
      3: 'Desde la entrada, ve recto al centro.',
      4: 'Desde la entrada, ve recto y gira a la derecha.',
      5: 'Desde la entrada, ve a la izquierda y luego adelante.',
      6: 'Desde la entrada, ve al centro.',
      7: 'Desde la entrada, ve a la derecha.',
      8: 'Desde la entrada, ve a la derecha y adelante.',
      9: 'Desde la entrada, ve al centro y luego a la izquierda.',
      10: 'Desde la entrada, ve al centro.',
      11: 'Desde la entrada, ve al centro y a la derecha.',
      12: 'Desde la entrada, ve adelante y a la izquierda.',
      13: 'Desde la entrada, ve adelante al centro.',
      14: 'Desde la entrada, ve adelante y a la derecha.',
      15: 'Desde la entrada, ve adelante y más a la derecha.'
    };

    if (rutas[mesaId]) {
      alert(`Ruta a la mesa ${mesaId}: ${rutas[mesaId]}`);
    }
  }

  if (reservaForm) {
    reservaForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;
      const personas = document.getElementById('personas').value;
      const mesa = mesaSeleccionadaInput.value;

      if (!mesa) {
        alert('Por favor, selecciona una mesa.');
        return;
      }

      alert(`Reserva enviada.\n\nNombre: ${nombre}\nFecha: ${fecha}\nHora: ${hora}\nPersonas: ${personas}\nMesa: ${mesa}\n\nNos vemos pronto en Mestrax.`);
      reservaForm.reset();
      mesaSeleccionada = null;
      generarMesas(); // Resetear mapa
    });
  }

  // Inicializar mapa de mesas
  generarMesas();
});