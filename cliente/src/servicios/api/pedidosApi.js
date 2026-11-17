import { peticion } from '../http.js';

const conEstado = (estado) => (estado ? `?estado=${encodeURIComponent(estado)}` : '');

export const pedidosApi = {
  crear: (datos) => peticion('/pedidos', { metodo: 'POST', datos }),
  mios: () => peticion('/pedidos/mios'),
  cola: (estado) => peticion(`/pedidos/cola${conEstado(estado)}`),
  cambiarEstado: (codigo, estado) => peticion(`/pedidos/${codigo}/estado`, { metodo: 'PATCH', datos: { estado } }),
  noGradeable: (codigo, indice, motivo) =>
    peticion(`/pedidos/${codigo}/articulos/${indice}/no-gradeable`, { metodo: 'POST', datos: { motivo } }),
  productos: (codigo) => peticion(`/pedidos/${codigo}/productos`),
};
