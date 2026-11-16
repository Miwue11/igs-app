import { useRutas } from './useRutas.js';
import { conBase } from './base.js';

const esClicNormal = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
const esInterno = (href) => href.startsWith('/');

/** <a> que navega dentro de la aplicación sin recargar (como el Link de React Router). */
export function Enlace({ href, onClick, children, ...props }) {
  const { navegar } = useRutas();

  const alPulsar = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || !esInterno(href) || !esClicNormal(e)) return;
    e.preventDefault();
    navegar(href);
  };

  return (
    <a href={esInterno(href) ? conBase(href) : href} onClick={alPulsar} {...props}>
      {children}
    </a>
  );
}
