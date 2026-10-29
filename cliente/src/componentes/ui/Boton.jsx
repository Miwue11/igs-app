import { Enlace } from '../../enrutador/Enlace.jsx';
import { clases } from '../../utilidades/clases.js';

const VARIANTES = { primario: 'boton-primario', oscuro: 'boton-oscuro', dorado: 'boton-dorado', contorno: 'boton-contorno' };

/** Botón de la marca. Con `href` se pinta como enlace con aspecto de botón. */
export function Boton({ variante = 'primario', grande, bloque, href, className, type = 'button', children, ...props }) {
  const clase = clases('boton', VARIANTES[variante], grande && 'boton-grande', bloque && 'boton-bloque', className);
  if (href) return <Enlace href={href} className={clase} {...props}>{children}</Enlace>;
  return <button type={type} className={clase} {...props}>{children}</button>;
}
