import { SUBNOTAS, LIMITES } from '@compartido';
import { formatoNota } from '../../utilidades/formato.js';

const porcentaje = (nota) => `${(Number(nota) / LIMITES.NOTA_MAX) * 100}%`;

export function Subnotas({ subnotas = {} }) {
  const conNota = SUBNOTAS.filter((s) => subnotas[s.id] != null);
  if (conNota.length === 0) return null;

  return (
    <div className="subnotas">
      <h2>Subnotas del gradeo</h2>
      {conNota.map((s) => (
        <div className="subnota" key={s.id}>
          <span>{s.nombre}</span>
          <div className="barra" aria-hidden="true"><div style={{ width: porcentaje(subnotas[s.id]) }} /></div>
          <strong>{formatoNota(subnotas[s.id])}</strong>
        </div>
      ))}
    </div>
  );
}
