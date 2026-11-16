import { nivelGrado } from '@compartido';
import { formatoNota } from '../../utilidades/formato.js';

/** Recuadro con la nota final y su nombre (9,5 · GEM MINT), del mismo color que el distintivo de la etiqueta. */
export function InsigniaNota({ nota, etiqueta }) {
  return (
    <div className={`insignia-nota insignia-${nivelGrado(nota, etiqueta)}`} aria-label={`Nota ${formatoNota(nota)}, ${etiqueta}`}>
      <strong>{formatoNota(nota)}</strong>
      <span>{etiqueta}</span>
    </div>
  );
}
