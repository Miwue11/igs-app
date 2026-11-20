import { VENTAJAS_CONFIANZA } from '../../constantes/contenido.js';
import { Icono } from '../ui/Icono.jsx';

/** Tres garantías de IGS justo debajo de la portada. */
export function FranjaConfianza() {
  return (
    <section className="franja-confianza" aria-label="Garantías de IGS">
      <ul className="contenedor">
        {VENTAJAS_CONFIANZA.map((v) => (
          <li key={v.titulo}>
            <span className="franja-icono"><Icono nombre={v.icono} tamano={24} /></span>
            <span><strong>{v.titulo}</strong>{v.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
