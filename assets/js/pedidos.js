import { obtenerPedidos, editarPedido, eliminarPedido } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaPedidos tbody');
  let pedidoIdEliminar = null;

  // LLAMAR A LOS COMPONENTES
  const filtroCliente = document.getElementById('filtroCliente');
  const filtroEstado = document.getElementById('filtroEstado');
  const filtroFecha = document.getElementById('filtroFecha');

  function mostrarPedidos() {
    let pedidos = obtenerPedidos();

    const clienteFiltro = filtroCliente ? filtroCliente.value.trim().toLowerCase() : '';
    const estadoFiltro = filtroEstado ? filtroEstado.value : '';
    const fechaFiltro = filtroFecha ? filtroFecha.value : '';

    pedidos = pedidos.filter(pedido => {
      const coincideCliente = pedido.cliente.toLowerCase().includes(clienteFiltro);
      const coincideEstado = estadoFiltro === '' || pedido.estado === estadoFiltro;
      const coincideFecha = fechaFiltro === '' || pedido.fechaEntrega === fechaFiltro;
      return coincideCliente && coincideEstado && coincideFecha;
    });

    if (pedidos.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7" class="text-muted">No hay pedidos registrados.</td></tr>';
      return;
    }

    tablaBody.innerHTML = '';

    pedidos.forEach((pedido, index) => {
      if (!pedido.estado) pedido.estado = 'Pendiente';

      // Si está entregado, deshabilitar select y botón eliminar
      const estaEntregado = pedido.estado === 'Entregado';

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${pedido.cliente}</td>
        <td>${pedido.tipoPrenda}</td>
        <td>${pedido.cantidad}</td>
        <td>${pedido.fechaEntrega}</td>
        <td>
          <select class="form-select form-select-sm estado-select" data-id="${pedido.id}" ${estaEntregado ? 'disabled' : ''}>
            <option value="Pendiente" ${pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="En proceso" ${pedido.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
            <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
          </select>
        </td>
        <td>
          <button 
            class="btn btn-sm btn-danger eliminar-btn" 
            data-id="${pedido.id}" 
            data-bs-toggle="modal" 
            data-bs-target="#confirmarEliminarModal"
            ${estaEntregado ? 'disabled title="No se puede eliminar un pedido entregado"' : ''}>
            Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  // BUSQUEDAS EN PEDIDOS
  if (filtroCliente) filtroCliente.addEventListener('input', mostrarPedidos);
  if (filtroEstado) filtroEstado.addEventListener('change', mostrarPedidos);
  if (filtroFecha) filtroFecha.addEventListener('change', mostrarPedidos);

  // CAMBIAR ESTADO
  tablaBody.addEventListener('change', e => {
    if (e.target.classList.contains('estado-select')) {
      const id = Number(e.target.dataset.id);
      const nuevoEstado = e.target.value;

      const pedidos = obtenerPedidos();
      const pedido = pedidos.find(p => p.id === id);
      if (pedido && pedido.estado !== 'Entregado') {  // solo editar si NO está entregado
        pedido.estado = nuevoEstado;
        editarPedido(id, pedido);
      } else {
        // Si está entregado, carga nuevamente la tabla de pedidos
        mostrarPedidos();
      }
    }
  });

  // VENTANA DE ELIMINAR
  tablaBody.addEventListener('click', e => {
    if (e.target.classList.contains('eliminar-btn')) {
      const id = Number(e.target.dataset.id);
      const pedidos = obtenerPedidos();
      const pedido = pedidos.find(p => p.id === id);

      if (pedido && pedido.estado !== 'Entregado') {  // solo si NO está entregado
        pedidoIdEliminar = id;
      } else {
        // No permitir eliminar ni abrir modal
        pedidoIdEliminar = null;
      }
    }
  });

  const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
  btnConfirmarEliminar.addEventListener('click', () => {
    if (pedidoIdEliminar !== null) {
      eliminarPedido(pedidoIdEliminar);
      mostrarPedidos();

      // Cerrar modal manualmente
      const modalEl = document.getElementById('confirmarEliminarModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      pedidoIdEliminar = null;
    }
  });

  mostrarPedidos();
});
