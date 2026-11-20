import { LIMITES } from '@compartido';
import { formatoNota } from '../../utilidades/formato.js';

const ajustar = (n) => Math.min(LIMITES.NOTA_MAX, Math.max(LIMITES.NOTA_MIN, n));

/**
 * Subnota con botones − / + de medio punto y atajo a 10: más rápido que un desplegable de 19 opciones.
 * Sin valor, el primer + pone 10 y el primer − pone 9,5 (casi todo lo que se gradea está arriba de la escala).
 */
export function CampoSubnota({ id, etiqueta, valor, alCambiar, error }) {
  const actual = valor === '' || valor == null ? null : Number(valor);
  const poner = (n) => alCambiar(String(ajustar(n)));
  const bajar = () => poner(actual == null ? LIMITES.NOTA_MAX - LIMITES.NOTA_PASO : actual - LIMITES.NOTA_PASO);
  const subir = () => poner(actual == null ? LIMITES.NOTA_MAX : actual + LIMITES.NOTA_PASO);

  return (
    <div className="campo-subnota" role="group" aria-labelledby={`${id}-titulo`}>
      <span id={`${id}-titulo`} className="campo-subnota-titulo">{etiqueta}</span>
      <div className="campo-subnota-control">
        <button type="button" onClick={bajar} aria-label={`Bajar ${etiqueta}`} disabled={actual === LIMITES.NOTA_MIN}>−</button>
        <output id={id} aria-live="polite" className={actual == null ? 'vacia' : undefined}>{actual == null ? '—' : formatoNota(actual)}</output>
        <button type="button" onClick={subir} aria-label={`Subir ${etiqueta}`} disabled={actual === LIMITES.NOTA_MAX}>+</button>
      </div>
      <button type="button" className="campo-subnota-diez" onClick={() => poner(LIMITES.NOTA_MAX)}>10</button>
      {error && <p className="campo-error">{error}</p>}
    </div>
  );
}
