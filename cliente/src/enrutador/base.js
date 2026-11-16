/**
 * Carpeta en la que está publicada la web ('' en la raíz, '/igs-app' en GitHub Pages).
 * Vite la toma de `base` (variable VITE_BASE al compilar).
 */
export const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');

/** Ruta interna (/consulta) → URL real del navegador (/igs-app/consulta). */
export const conBase = (ruta) => `${BASE}${ruta}`;

/** URL real del navegador → ruta interna de la aplicación. */
export const sinBase = (ruta) => (BASE && ruta.startsWith(BASE) ? ruta.slice(BASE.length) || '/' : ruta);
