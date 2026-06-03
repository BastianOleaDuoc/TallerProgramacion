document.addEventListener('DOMContentLoaded', function() {
  const reservaForm = document.getElementById('reservaForm');
  const areaPrincipal = document.querySelector('.area-principal');
  const mesaSeleccionadaInput = document.getElementById('mesaSeleccionada');
  const inputFecha = document.getElementById('fecha');
  const inputHora = document.getElementById('hora');

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

        if (mesaSeleccionada === pos.id) {
          mesaDiv.classList.add('seleccionada');
        }
        mesaDiv.addEventListener('click', () => seleccionarMesa(pos.id, mesaDiv));
      }

      areaPrincipal.appendChild(mesaDiv);
    });
  }


  async function actualizarMesasDisponibles() {
    const fecha = inputFecha.value;
    const hora = inputHora.value;


    if (!fecha || !hora) return;

    try {
      const respuesta = await fetch(`http://localhost/mestrax/backend/reservas/obtener_mesas_ocupadas.php?fecha=${fecha}&hora=${hora}`);
      const resultado = await respuesta.json();

      if (resultado.status === "success") {
        mesasOcupadas = resultado.mesasOcupadas;
        

        if (mesasOcupadas.includes(mesaSeleccionada)) {
          mesaSeleccionada = null;
          mesaSeleccionadaInput.value = "";
        }

        generarMesas(); 
      }
    } catch (error) {
      console.error("Error al obtener disponibilidad de mesas:", error);
    }
  }


  if (inputFecha) inputFecha.addEventListener('change', actualizarMesasDisponibles);
  if (inputHora) inputHora.addEventListener('change', actualizarMesasDisponibles);

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
    mesaSeleccionadaInput.value = numero;
  }

  if (reservaForm) {
    reservaForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const mesa = mesaSeleccionadaInput ? mesaSeleccionadaInput.value : null;

      if (!mesa) {
        alert('Por favor, selecciona una mesa en nuestro mapa interactivo.');
        return;
      }

      const datosFormulario = new FormData(reservaForm);

      try {
        const respuesta = await fetch("http://localhost/mestrax/backend/reservas/crear_reserva.php", {
          method: "POST",
          body: datosFormulario
        });


        const resultadoTexto = await respuesta.text();
        console.log("Respuesta del servidor:", resultadoTexto);


        if (resultadoTexto.includes("éxito") || resultadoTexto.includes("success") || resultadoTexto.includes("agendada")) {
          alert("¡Reserva agendada con éxito! Te esperamos en Mestrax.");
          reservaForm.reset();
          mesaSeleccionada = null;
          if (mesaSeleccionadaInput) mesaSeleccionadaInput.value = "";
          mesasOcupadas = [];
          generarMesas(); 
        } else {

          alert("Aviso del servidor: " + resultadoTexto);
        }

      } catch (error) {
        console.error("Error crítico al guardar la reserva:", error);
        alert("Hubo un problema de conexión al procesar tu reserva.");
      }
    });
  }

  generarMesas();
});