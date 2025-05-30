import {
  obtenerClientes,
  guardarCliente,
  editarCliente,
  eliminarCliente,
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // LLAMAMOS A LOS CAMPOS HTML
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

  const tituloModal = document.querySelector('#modalAgregarClienteLabel');
  const btnGuardar = formAgregarCliente ? formAgregarCliente.querySelector('button[type="submit"]') : null;

  let clienteIdEliminar = null;
  let clienteEnEdicion = null;

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
          <button class="btn btn-primary btn-sm editar-cliente-btn me-1" data-id="${cliente.id}" title="Editar">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button class="btn btn-danger btn-sm eliminar-cliente-btn" data-id="${cliente.id}" title="Eliminar">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // Evento: Agregar nuevo cliente o editar existente
  formAgregarCliente?.addEventListener('submit', e => {
    e.preventDefault();

    if (!formAgregarCliente.checkValidity()) {
      formAgregarCliente.classList.add('was-validated');
      return;
    }

    const clienteData = {
      nombre: document.getElementById('nombreCliente').value.trim(),
      correo: document.getElementById('correoCliente').value.trim(),
      telefono: document.getElementById('telefonoCliente').value.trim(),
    };

    if (clienteEnEdicion !== null) {
      // Editar cliente existente
      editarCliente(clienteEnEdicion, clienteData);
    } else {
      // Guardar nuevo cliente
      guardarCliente(clienteData);
    }

    mostrarClientes();
    modalAgregarCliente?.hide();
    formAgregarCliente.reset();
    formAgregarCliente.classList.remove('was-validated');

    clienteEnEdicion = null;
    tituloModal.textContent = 'Agregar Cliente';
    btnGuardar.textContent = 'Agregar';
  });

  // BORRAR DATOS DEL FORMULARIO
  btnLimpiarFormulario?.addEventListener('click', () => {
    formAgregarCliente.reset();
    formAgregarCliente.classList.remove('was-validated');
    clienteEnEdicion = null;
    tituloModal.textContent = 'Agregar Cliente';
    btnGuardar.textContent = 'Agregar';
  });

  // AGREGAR CLIENTE
  btnAbrirModalAgregarCliente?.addEventListener('click', () => {
    clienteEnEdicion = null;
    formAgregarCliente.reset();
    formAgregarCliente.classList.remove('was-validated');
    tituloModal.textContent = 'Agregar Cliente';
    btnGuardar.textContent = 'Agregar';
    modalAgregarCliente?.show();
  });

  // BUSQUEDA POR NOMBRE
  filtroNombre?.addEventListener('input', mostrarClientes);

  // EDITAR CLIENTE
  tablaBody.addEventListener('click', e => {
    const btnEliminar = e.target.closest('.eliminar-cliente-btn');
    if (btnEliminar) {
      clienteIdEliminar = Number(btnEliminar.dataset.id);
      modalConfirmarEliminar?.show();
      return;
    }

    const btnEditar = e.target.closest('.editar-cliente-btn');
    if (btnEditar) {
      const id = Number(btnEditar.dataset.id);
      const clientes = obtenerClientes();
      const cliente = clientes.find(c => c.id === id);
      if (cliente) {
        clienteEnEdicion = cliente.id;

        document.getElementById('nombreCliente').value = cliente.nombre;
        document.getElementById('correoCliente').value = cliente.correo;
        document.getElementById('telefonoCliente').value = cliente.telefono || '';

        tituloModal.textContent = 'Editar Cliente';
        btnGuardar.textContent = 'Guardar Cambios';

        modalAgregarCliente?.show();
      }
    }
  });

  // ELIMINAR CLIENTE
  btnConfirmarEliminarCliente?.addEventListener('click', () => {
    if (clienteIdEliminar !== null) {
      eliminarCliente(clienteIdEliminar);
      mostrarClientes();
      clienteIdEliminar = null;
      modalConfirmarEliminar?.hide();
    }
  });

  // Inicializar tabla al cargar página
  mostrarClientes();
});
