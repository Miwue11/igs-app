import { clases } from '../../utilidades/clases.js';

/** Imagen o, si no hay, un hueco gris con el texto indicado. */
export function Foto({ src, texto, className }) {
  if (src) return <img src={src} alt={texto} className={clases('foto', className)} />;
  return <div className={clases('hueco', className)}>[{texto}]</div>;
}
