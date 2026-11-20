import { clases } from '../../utilidades/clases.js';

/** Contenedor blanco con borde. `destacada` le pone el borde dorado de la marca. */
export function Tarjeta({ como: Etiqueta = 'article', destacada, className, children, ...props }) {
  return (
    <Etiqueta className={clases('tarjeta', destacada && 'tarjeta--destacada', className)} {...props}>
      {children}
    </Etiqueta>
  );
}
