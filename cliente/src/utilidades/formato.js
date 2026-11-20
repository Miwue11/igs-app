const EUROS = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: 'always' });
const ENTERO = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });
const NUMERO = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
const FECHA = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** null en el catálogo significa "a consultar" o "sin límite". */
export const formatoPrecio = (precio) => (precio == null ? 'A consultar' : EUROS.format(precio));
export const formatoPlazo = (dias) => `${dias} ${dias === 1 ? 'día' : 'días'}`;
export const formatoValorMax = (valor) => (valor == null ? 'Sin límite' : EUROS.format(valor));
export const formatoNota = (nota) => (nota == null ? '—' : NUMERO.format(nota));
export const formatoFecha = (iso) => (iso ? FECHA.format(new Date(iso)) : '—');
export const formatoEntero = (n) => ENTERO.format(n);
/** Singular o plural: plural(1, 'artículo') → «1 artículo», plural(3, 'artículo') → «3 artículos». */
export const plural = (n, palabra, varias = `${palabra}s`) => `${formatoEntero(n)} ${n === 1 ? palabra : varias}`;
