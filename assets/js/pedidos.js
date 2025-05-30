import { obtenerPedidos, editarPedido, eliminarPedido } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#tablaPedidos tbody');
  const filtroCliente = document.getElementById('filtroCliente');
  const filtroEstado = document.getElementById('filtroEstado');
  const filtroFecha = document.getElementById('filtroFecha');
  const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
  let pedidoIdEliminar = null;

  function puedeModificar(pedido) {
    return pedido && pedido.estado !== 'Entregado';
  }


  // LISTAR PEDIDOS
  function mostrarPedidos() {
    let pedidos = obtenerPedidos();

    const clienteFiltro = filtroCliente.value.trim().toLowerCase();
    const estadoFiltro = filtroEstado.value;
    const fechaFiltro = filtroFecha.value;

    pedidos = pedidos.filter(pedido => {
      const coincideCliente = pedido.cliente.toLowerCase().includes(clienteFiltro);
      const coincideEstado = estadoFiltro === '' || pedido.estado === estadoFiltro;
      const coincideFecha = fechaFiltro === '' || pedido.fechaEntrega === fechaFiltro;
      return coincideCliente && coincideEstado && coincideFecha;
    });

    tablaBody.innerHTML = '';

    if (pedidos.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7" class="text-muted">No hay pedidos registrados.</td></tr>';
      return;
    }

    pedidos.forEach((pedido, index) => {
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

  filtroCliente.addEventListener('input', mostrarPedidos);
  filtroEstado.addEventListener('change', mostrarPedidos);
  filtroFecha.addEventListener('change', mostrarPedidos);

  tablaBody.addEventListener('change', e => {
    if (e.target.classList.contains('estado-select')) {
      const id = Number(e.target.dataset.id);
      const nuevoEstado = e.target.value;

      const pedidos = obtenerPedidos();
      const pedido = pedidos.find(p => p.id === id);

      if (puedeModificar(pedido)) {
        pedido.estado = nuevoEstado;
        editarPedido(id, pedido);
      } else {
        mostrarPedidos();
      }
    }
  });

  tablaBody.addEventListener('click', e => {
    if (e.target.classList.contains('eliminar-btn')) {
      const id = Number(e.target.dataset.id);
      const pedido = obtenerPedidos().find(p => p.id === id);
      pedidoIdEliminar = puedeModificar(pedido) ? id : null;
    }
  });

  btnConfirmarEliminar.addEventListener('click', () => {
    if (pedidoIdEliminar !== null) {
      eliminarPedido(pedidoIdEliminar);
      mostrarPedidos();

      const modalEl = document.getElementById('confirmarEliminarModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      pedidoIdEliminar = null;
    }
  });

  mostrarPedidos();
});
