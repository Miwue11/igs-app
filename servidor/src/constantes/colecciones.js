/** Nombres de las colecciones de MongoDB (en español y fijos, sin el plural automático de Mongoose). */
export const COLECCIONES = Object.freeze({
  USUARIOS: 'usuarios',
  SERVICIOS: 'servicios',
  PEDIDOS: 'pedidos',
  PRODUCTOS: 'productos',
  TICKETS: 'tickets',
  CONTADORES: 'contadores',
  FOTOS: 'fotos',
  CATALOGO_CARTAS: 'catalogo_cartas',
});

/** Fechas automáticas de cada documento con nombres en español. */
export const MARCAS_TIEMPO = Object.freeze({ createdAt: 'creadoEn', updatedAt: 'actualizadoEn' });
