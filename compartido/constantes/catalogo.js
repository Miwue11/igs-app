/** Categorías de producto (lo que se gradea). */
export const CATEGORIAS = Object.freeze([
  { id: 'tcg', nombre: 'Cartas TCG' },
  { id: 'deportivas', nombre: 'Cartas deportivas' },
  { id: 'comics', nombre: 'Cómics' },
]);

export const IDS_CATEGORIA = Object.freeze(CATEGORIAS.map((c) => c.id));

export const nombreCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;

/**
 * Categorías de servicio (para quién es). Los niveles Estándar, Express y Premium valen para
 * cualquier carta, TCG o deportiva: lo que cambia entre ellos es el valor declarado y el plazo.
 */
export const CATEGORIAS_SERVICIO = Object.freeze([
  { id: 'cartas', nombre: 'Cartas TCG y deportivas' },
  { id: 'comics', nombre: 'Cómics' },
]);

export const IDS_CATEGORIA_SERVICIO = Object.freeze(CATEGORIAS_SERVICIO.map((c) => c.id));

export const nombreCategoriaServicio = (id) =>
  CATEGORIAS_SERVICIO.find((c) => c.id === id)?.nombre ?? id;

/** Aspectos que se puntúan en cada gradeo. */
export const SUBNOTAS = Object.freeze([
  { id: 'centrado', nombre: 'Centrado' },
  { id: 'esquinas', nombre: 'Esquinas' },
  { id: 'bordes', nombre: 'Bordes' },
  { id: 'superficie', nombre: 'Superficie' },
]);

export const TIPOS_TICKET = Object.freeze([
  { id: 'pedido', nombre: 'Estado de mi pedido' },
  { id: 'certificacion', nombre: 'Error en una certificación' },
  { id: 'pagos', nombre: 'Pagos y facturas' },
  { id: 'cuenta', nombre: 'Acceso a mi cuenta' },
  { id: 'otro', nombre: 'Otro' },
]);

export const IDS_TIPO_TICKET = Object.freeze(TIPOS_TICKET.map((t) => t.id));

export const IDIOMAS = Object.freeze(['Español', 'Inglés', 'Japonés', 'Francés', 'Alemán', 'Italiano', 'Otro']);
