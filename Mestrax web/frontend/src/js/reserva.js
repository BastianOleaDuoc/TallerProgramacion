document.addEventListener('DOMContentLoaded', function() {
  const reservaForm = document.getElementById('reservaForm');
  const areaPrincipal = document.querySelector('.area-principal');
  const mesaSeleccionadaInput = document.getElementById('mesaSeleccionada');

  let mesaSeleccionada = null;
  let mesasOcupadas = []; 

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


  async function cargarMesasOcupadas() {
    try {
      const response = await fetch("http://localhost:8080/api/reservas");
      if (response.ok) {
        const reservas = await response.json();

        mesasOcupadas = reservas.map(r => Number(r.mesa));
      }
    } catch (error) {
      console.error("Error al obtener mesas ocupadas de la BD. Usando respaldo local.", error);
      mesasOcupadas = [5, 10, 14]; 
    }
    generarMesas(); 
  }

  function generarMesas() {
    if (!areaPrincipal) return;
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
    if (mesaSeleccionada) {
      const mesaAnterior = document.querySelector('.mesa.seleccionada');
      if (mesaAnterior) {
        mesaAnterior.classList.remove('seleccionada');
        mesaAnterior.classList.add('libre');
      }
    }

    elemento.classList.remove('libre');
    elemento.classList.add('seleccionada');
    mesaSeleccionada = numero;
    if (mesaSeleccionadaInput) mesaSeleccionadaInput.value = numero;
  }


  if (reservaForm) {
    reservaForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;
      const personas = document.getElementById('personas').value;
      const mesa = mesaSeleccionadaInput ? mesaSeleccionadaInput.value : mesaSeleccionada;

      if (!mesa) {
        alert('Por favor, selecciona una mesa.');
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/reservas", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre,
            fecha: fecha,
            hora: hora,
            personas: Number(personas),
            mesa: Number(mesa)
          }),
        });

        if (!response.ok) throw new Error("Error al procesar reserva");

        alert(`¡Reserva confirmada con éxito!\n\nMesa: ${mesa}\nFecha: ${fecha}\nHora: ${hora}\n\nTe esperamos en Mestrax.`);
        
        reservaForm.reset();
        mesaSeleccionada = null;
        if (mesaSeleccionadaInput) mesaSeleccionadaInput.value = '';
        

        await cargarMesasOcupadas();

      } catch (error) {
        console.error(error);
        alert("Hubo un problema al conectar con el servidor. Tu reserva no pudo ser guardada.");
      }
    });
  }


  cargarMesasOcupadas();
});