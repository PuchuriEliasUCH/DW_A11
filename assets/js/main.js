// Ruta: assets/js/main.js
import { obtenerPedidos, obtenerClientes } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const pedidos = obtenerPedidos();
  const clientes = obtenerClientes();

  let pendientes = 0;
  let enProceso = 0;
  let entregados = 0;

  pedidos.forEach(pedido => {
    switch (pedido.estado) {
      case 'Pendiente':
        pendientes++;
        break;
      case 'En proceso':
        enProceso++;
        break;
      case 'Entregado':
        entregados++;
        break;
    }
  });

  document.getElementById('pedidosPendientes').textContent = pendientes;
  document.getElementById('pedidosEnProceso').textContent = enProceso;
  document.getElementById('pedidosEntregados').textContent = entregados;
  document.getElementById('clientesRegistrados').textContent = clientes.length;
});
