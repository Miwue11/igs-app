import { accesoApi } from './accesoApi.js';
import { serviciosApi } from './serviciosApi.js';
import { productosApi } from './productosApi.js';
import { pedidosApi } from './pedidosApi.js';
import { ticketsApi } from './ticketsApi.js';
import { usuariosApi } from './usuariosApi.js';
import { iaApi } from './iaApi.js';
import { catalogoApi } from './catalogoApi.js';

/** Implementación real: habla con el servidor Node por HTTP. */
export const apiServidor = {
  acceso: accesoApi,
  servicios: serviciosApi,
  productos: productosApi,
  pedidos: pedidosApi,
  tickets: ticketsApi,
  usuarios: usuariosApi,
  ia: iaApi,
  catalogo: catalogoApi,
};
