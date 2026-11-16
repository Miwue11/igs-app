import { etiquetaGrado as nombreGrado, nivelGrado } from '@compartido';
import { formatoNota } from '../../utilidades/formato.js';
import { clases } from '../../utilidades/clases.js';

const NOMBRE_LARGO = 26;

/**
 * Etiqueta oficial del slab de IGS: logo, año, expansión, nombre, nº de certificado y grado.
 * El distintivo del grado cambia de color:
 *   rojo metálico → 10 PRISTINE · dorado → 10 GEM MINT y 9,5 · plateado → del 9 hacia abajo.
 * Recibe un producto (o los valores del formulario para la vista previa).
 */
export function EtiquetaIGS({ producto, className }) {
  const { idCertificado, nombre, anio, expansion, nota, subnotas } = producto;
  const tieneNota = nota !== '' && nota != null;
  const grado = producto.etiquetaGrado || (tieneNota ? nombreGrado(nota, subnotas) : '');
  const nivel = tieneNota ? nivelGrado(nota, grado) : 'vacio';
  const titulo = nombre?.trim() || 'Nombre del producto';
  const certificado = idCertificado || 'Se asigna al guardar';
  const textoNota = tieneNota ? formatoNota(nota) : '—';

  const descripcion = [
    'Etiqueta IGS', titulo, expansion, anio,
    tieneNota ? `grado ${formatoNota(nota)} ${grado}` : 'sin grado', `certificado ${certificado}`,
  ].filter(Boolean).join(', ');

  return (
    <div className={clases('etiqueta-igs', `etiqueta-${nivel}`, className)} role="img" aria-label={descripcion}>
      <div className="etiqueta-marca" aria-hidden="true">
        <strong>IGS</strong>
        <span className="etiqueta-rayas"><i /><i /></span>
        <small>Iberian Grading<br />Services</small>
      </div>

      <div className="etiqueta-datos" aria-hidden="true">
        <div className="etiqueta-fila">
          <div><small>Año</small><span>{anio || '—'}</span></div>
          <div><small>Expansión</small><span>{expansion || '—'}</span></div>
        </div>
        <p className={clases('etiqueta-nombre', titulo.length > NOMBRE_LARGO && 'largo')}>{titulo}</p>
        <small className="etiqueta-cert">Nº cert. {certificado}</small>
      </div>

      <div className="etiqueta-grado" aria-hidden="true">
        <div>
          <small>Grado</small>
          <strong className={textoNota.length > 2 ? 'decimal' : undefined}>{textoNota}</strong>
          <span>{grado}</span>
        </div>
      </div>
    </div>
  );
}
