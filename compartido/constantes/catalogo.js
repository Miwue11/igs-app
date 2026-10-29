/** Categorías de producto y de servicio. */
export const CATEGORIAS = Object.freeze([
  { id: 'tcg', nombre: 'Cartas TCG' },
  { id: 'deportivas', nombre: 'Deportivas' },
  { id: 'comics', nombre: 'Cómics' },
  { id: 'empresas', nombre: 'Empresas' },
]);

export const IDS_CATEGORIA = Object.freeze(CATEGORIAS.map((c) => c.id));

export const nombreCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;

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
  { id: 'otro', nombre: 'Otro' },
]);

export const IDS_TIPO_TICKET = Object.freeze(TIPOS_TICKET.map((t) => t.id));

export const IDIOMAS = Object.freeze(['Español', 'Inglés', 'Japonés', 'Francés', 'Alemán', 'Italiano', 'Otro']);
