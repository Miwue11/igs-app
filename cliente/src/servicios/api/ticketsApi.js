import { peticion } from '../http.js';

export const ticketsApi = {
  crear: (datos) => peticion('/tickets', { metodo: 'POST', datos }),
  listar: (estado) => peticion(`/tickets${estado ? `?estado=${estado}` : ''}`),
  cambiarEstado: (codigo, estado) => peticion(`/tickets/${codigo}/estado`, { metodo: 'PATCH', datos: { estado } }),
  responder: (codigo, mensaje) => peticion(`/tickets/${codigo}/respuestas`, { metodo: 'POST', datos: { mensaje } }),
};
