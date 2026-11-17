import { conBase } from '../../enrutador/base.js';
import { clases } from '../../utilidades/clases.js';

/** Las rutas propias (/fotos/…, /ejemplos/…) se sirven desde la carpeta de la web (en GitHub Pages, /igs-app/…). */
export const rutaImagen = (src) => (src?.startsWith('/') ? conBase(src) : src);

/** Imagen o, si no hay, un hueco gris con el texto indicado. */
export function Foto({ src, texto, className }) {
  if (src) return <img src={rutaImagen(src)} alt={texto} className={clases('foto', className)} />;
  return <div className={clases('hueco', className)}>[{texto}]</div>;
}
