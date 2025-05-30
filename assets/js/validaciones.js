import { guardarPedido } from './storage.js'; 

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formPedido');
  const clienteSelect = document.getElementById('cliente');  
  const tipoPrendaInput = document.getElementById('tipoPrenda');
  const cantidadInput = document.getElementById('cantidad');
  const fechaEntregaInput = document.getElementById('fechaEntrega');

  // FECHA MÍNIMA (mañana)
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  fechaEntregaInput.min = `${yyyy}-${mm}-${dd}`;

  // TOAST DE CONFIRMACIÓN
  const toastRegistroEl = document.getElementById('toastRegistro');
  const toastRegistro = new bootstrap.Toast(toastRegistroEl);

  // MOSTRAR Y LIMPIAR ERRORES
  function mostrarError(input, mensaje) {
    limpiarError(input);
    const error = document.createElement('div');
    error.className = 'text-danger small mt-1';
    error.textContent = mensaje;
    input.parentNode.appendChild(error);
  }

  function limpiarError(input) {
    const parent = input.parentNode;
    const error = parent.querySelector('.text-danger');
    if (error) {
      parent.removeChild(error);
    }
  }

  // BLOQUEAR NÚMEROS EN TEXTO
  function bloquearNumeros(event) {
    const tecla = event.key;
    if (/\d/.test(tecla)) {
      event.preventDefault();
    }
  }
  tipoPrendaInput.addEventListener('keypress', bloquearNumeros);

  // VALIDACIÓN DEL FORMULARIO
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valido = true;

    [clienteSelect, tipoPrendaInput, cantidadInput, fechaEntregaInput].forEach(limpiarError);

    if (!clienteSelect.value) {
      mostrarError(clienteSelect, 'Por favor selecciona un cliente.');
      valido = false;
    }

    if (tipoPrendaInput.value.trim() === '') {
      mostrarError(tipoPrendaInput, 'El tipo de prenda es obligatorio.');
      valido = false;
    }

    const cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      mostrarError(cantidadInput, 'La cantidad debe ser un número mayor o igual a 1.');
      valido = false;
    }

    const fechaEntrega = new Date(fechaEntregaInput.value);
    const fechaMinima = new Date(fechaEntregaInput.min);

    if (fechaEntrega < fechaMinima || isNaN(fechaEntrega.getTime())) {
      mostrarError(fechaEntregaInput, 'La fecha de entrega debe ser una fecha futura.');
      valido = false;
    }

    if (valido) {
      const nuevoPedido = {
        cliente: clienteSelect.value,
        tipoPrenda: tipoPrendaInput.value.trim(),
        cantidad: cantidad,
        fechaEntrega: fechaEntregaInput.value,
        estado: 'Pendiente'
      };

      guardarPedido(nuevoPedido);

      toastRegistro.show();
      form.reset();
      clienteSelect.selectedIndex = 0;
    }
  });

  // CARGAR CLIENTES EN EL SELECT
  function cargarClientes() {
    const clientesJson = localStorage.getItem('clientes_lavanderia');

    clienteSelect.innerHTML = '';

    const optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = '';
    optionPlaceholder.textContent = 'Selecciona un cliente';
    optionPlaceholder.disabled = true;
    optionPlaceholder.selected = true;
    clienteSelect.appendChild(optionPlaceholder);

    if (clientesJson) {
      try {
        const clientes = JSON.parse(clientesJson);
        clientes.forEach(cliente => {
          const option = document.createElement('option');
          option.value = cliente.nombre;
          option.textContent = cliente.nombre;
          clienteSelect.appendChild(option);
        });
      } catch (error) {
        console.error('Error al parsear clientes desde localStorage:', error);
      }
    } else {
      const optionNone = document.createElement('option');
      optionNone.value = '';
      optionNone.textContent = 'No hay clientes disponibles';
      optionNone.disabled = true;
      clienteSelect.appendChild(optionNone);
    }
  }

  // EJECUTAR AL CARGAR
  cargarClientes();
});
