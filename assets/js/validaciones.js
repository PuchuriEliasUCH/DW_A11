import { guardarPedido } from './storage.js'; // Asegúrate que la ruta sea correcta

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formPedido');
  const clienteSelect = document.getElementById('cliente');  // Select cliente
  const tipoPrendaInput = document.getElementById('tipoPrenda');
  const cantidadInput = document.getElementById('cantidad');
  const fechaEntregaInput = document.getElementById('fechaEntrega');

  function cargarClientes() {
    // Cambié la clave para que coincida con storage.js
    const clientesJson = localStorage.getItem('clientes_lavanderia');

    // Limpiar select para cargar opciones nuevas
    clienteSelect.innerHTML = '';

    // Opción placeholder
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
          option.value = cliente.nombre;  // Usas nombre como valor (ok)
          option.textContent = cliente.nombre;
          clienteSelect.appendChild(option);
        });
      } catch (error) {
        console.error('Error al parsear clientes desde localStorage:', error);
      }
    } else {
      // Si no hay clientes, mostrar opción de aviso
      const optionNone = document.createElement('option');
      optionNone.value = '';
      optionNone.textContent = 'No hay clientes disponibles';
      optionNone.disabled = true;
      clienteSelect.appendChild(optionNone);
    }
  }


  // Cargar clientes al iniciar la página
  cargarClientes();

  // Establecer fecha mínima (mañana) para el input de fecha
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1); // Día siguiente
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  fechaEntregaInput.min = `${yyyy}-${mm}-${dd}`;

  // Toast Bootstrap para confirmación
  const toastRegistroEl = document.getElementById('toastRegistro');
  const toastRegistro = new bootstrap.Toast(toastRegistroEl);

  // Función para mostrar mensaje de error debajo del input/select
  function mostrarError(input, mensaje) {
    limpiarError(input);
    const error = document.createElement('div');
    error.className = 'text-danger small mt-1';
    error.textContent = mensaje;
    input.parentNode.appendChild(error);
  }

  // Quitar mensaje de error existente
  function limpiarError(input) {
    const parent = input.parentNode;
    const error = parent.querySelector('.text-danger');
    if (error) {
      parent.removeChild(error);
    }
  }

  // Bloquear ingreso de números en input tipoPrenda (mantengo este evento)
  function bloquearNumeros(event) {
    const tecla = event.key;
    if (/\d/.test(tecla)) {
      event.preventDefault();
    }
  }
  tipoPrendaInput.addEventListener('keypress', bloquearNumeros);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valido = true;

    // Limpiar errores previos
    [clienteSelect, tipoPrendaInput, cantidadInput, fechaEntregaInput].forEach(limpiarError);

    // Validar cliente (select debe tener valor seleccionado)
    if (!clienteSelect.value) {
      mostrarError(clienteSelect, 'Por favor selecciona un cliente.');
      valido = false;
    }

    // Validar tipo prenda (no vacío)
    if (tipoPrendaInput.value.trim() === '') {
      mostrarError(tipoPrendaInput, 'El tipo de prenda es obligatorio.');
      valido = false;
    }

    // Validar cantidad (número >= 1)
    const cantidad = parseInt(cantidadInput.value, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      mostrarError(cantidadInput, 'La cantidad debe ser un número mayor o igual a 1.');
      valido = false;
    }

    // Validar fecha entrega (fecha futura, no hoy ni antes)
    const fechaEntrega = new Date(fechaEntregaInput.value);
    const fechaMinima = new Date(fechaEntregaInput.min);

    if (fechaEntrega < fechaMinima || isNaN(fechaEntrega.getTime())) {
      mostrarError(fechaEntregaInput, 'La fecha de entrega debe ser una fecha futura.');
      valido = false;
    }

    if (valido) {
      // Crear y guardar el pedido
      const nuevoPedido = {
        cliente: clienteSelect.value,
        tipoPrenda: tipoPrendaInput.value.trim(),
        cantidad: cantidad,
        fechaEntrega: fechaEntregaInput.value,
        estado: 'Pendiente'
      };

      guardarPedido(nuevoPedido);

      toastRegistro.show();  // Mostrar confirmación
      form.reset();          // Limpiar formulario

      // Para evitar que quede seleccionado el placeholder
      clienteSelect.selectedIndex = 0;
    }
  });
});
