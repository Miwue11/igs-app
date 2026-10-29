import { formatoNota } from '../../utilidades/formato.js';

/** Recuadro dorado con la nota final y su nombre (9,5 · GEM MINT). */
export function InsigniaNota({ nota, etiqueta }) {
  return (
    <div className="insignia-nota" aria-label={`Nota ${formatoNota(nota)}, ${etiqueta}`}>
      <strong>{formatoNota(nota)}</strong>
      <span>{etiqueta}</span>
    </div>
  );
}
