// assets/js/storage.js

const STORAGE_KEYS = {
  pedidos: 'pedidos_lavanderia',
  clientes: 'clientes_lavanderia',
};

/** --- PEDIDOS --- **/

export function obtenerPedidos() {
  const pedidos = localStorage.getItem(STORAGE_KEYS.pedidos);
  return pedidos ? JSON.parse(pedidos) : [];
}

export function guardarPedido(pedido) {
  const pedidos = obtenerPedidos();
  pedido.id = Date.now();
  pedidos.push(pedido);
  localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(pedidos));
}

export function editarPedido(id, pedidoActualizado) {
  const pedidos = obtenerPedidos();
  const index = pedidos.findIndex(p => p.id === id);
  if (index !== -1) {
    pedidos[index] = { id, ...pedidoActualizado };
    localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(pedidos));
  }
}

export function eliminarPedido(id) {
  let pedidos = obtenerPedidos();
  pedidos = pedidos.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(pedidos));
}

/** --- CLIENTES --- **/

export function obtenerClientes() {
  const clientes = localStorage.getItem(STORAGE_KEYS.clientes);
  return clientes ? JSON.parse(clientes) : [];
}

export function guardarCliente(cliente) {
  const clientes = obtenerClientes();
  cliente.id = Date.now();
  clientes.push(cliente);
  localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes));
}

export function editarCliente(id, clienteActualizado) {
  const clientes = obtenerClientes();
  const index = clientes.findIndex(c => c.id === id);
  if (index !== -1) {
    clientes[index] = { id, ...clienteActualizado };
    localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes));
  }
}

export function eliminarCliente(id) {
  let clientes = obtenerClientes();
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes));
}
