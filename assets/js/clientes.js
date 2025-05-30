import {
  obtenerClientes,
  guardarCliente,
  eliminarCliente,
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaClientes tbody');
  const filtroNombre = document.getElementById('filtroNombre');
  const formAgregarCliente = document.getElementById('formAgregarCliente');
  const btnLimpiarFormulario = document.getElementById('btnLimpiarFormulario');
  const btnConfirmarEliminarCliente = document.getElementById('btnConfirmarEliminarCliente');
  const btnAbrirModalAgregarCliente = document.getElementById('abrirModalAgregarCliente');

  const modalAgregarClienteEl = document.getElementById('modalAgregarCliente');
  const modalConfirmarEliminarEl = document.getElementById('confirmarEliminarClienteModal');

  const modalAgregarCliente = modalAgregarClienteEl ? new bootstrap.Modal(modalAgregarClienteEl) : null;
  const modalConfirmarEliminar = modalConfirmarEliminarEl ? new bootstrap.Modal(modalConfirmarEliminarEl) : null;

  let clienteIdEliminar = null;

  function mostrarClientes() {
    const clientes = obtenerClientes();
    const nombreFiltro = filtroNombre?.value.trim().toLowerCase() || '';

    const clientesFiltrados = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(nombreFiltro)
    );

    tablaBody.innerHTML = '';

    if (clientesFiltrados.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5" class="text-center">No se encontraron clientes.</td></tr>`;
      return;
    }

    clientesFiltrados.forEach((cliente, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono || ''}</td>
        <td>
          <button class="btn btn-danger btn-sm eliminar-cliente-btn" data-id="${cliente.id}" title="Eliminar">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // Evento: Agregar nuevo cliente
  formAgregarCliente?.addEventListener('submit', e => {
    e.preventDefault();

    if (!formAgregarCliente.checkValidity()) {
      formAgregarCliente.classList.add('was-validated');
      return;
    }

    const nuevoCliente = {
      nombre: document.getElementById('nombreCliente').value.trim(),
      correo: document.getElementById('correoCliente').value.trim(),
      telefono: document.getElementById('telefonoCliente').value.trim(),
    };

    guardarCliente(nuevoCliente);
    mostrarClientes();

    modalAgregarCliente?.hide();
    formAgregarCliente.reset();
    formAgregarCliente.classList.remove('was-validated');
  });

  // Evento: Limpiar formulario
  btnLimpiarFormulario?.addEventListener('click', () => {
    formAgregarCliente.reset();
    formAgregarCliente.classList.remove('was-validated');
  });

  // Evento: Filtro nombre
  filtroNombre?.addEventListener('input', mostrarClientes);

  // Evento: Mostrar confirmación para eliminar
  tablaBody.addEventListener('click', e => {
    const btn = e.target.closest('.eliminar-cliente-btn');
    if (btn) {
      clienteIdEliminar = Number(btn.dataset.id);
      modalConfirmarEliminar?.show();
    }
  });

  // Evento: Confirmar eliminación
  btnConfirmarEliminarCliente?.addEventListener('click', () => {
    if (clienteIdEliminar !== null) {
      eliminarCliente(clienteIdEliminar);
      mostrarClientes();
      clienteIdEliminar = null;
      modalConfirmarEliminar?.hide();
    }
  });

  // Evento: Abrir modal para agregar cliente
  btnAbrirModalAgregarCliente?.addEventListener('click', () => {
    modalAgregarCliente?.show();
  });

  // Inicializar tabla
  mostrarClientes();
});
