import { ENLACES_LEGALES } from '../../constantes/navegacion.js';
import { TEXTO_PIE } from '../../constantes/contenido.js';
import { Enlace } from '../../enrutador/Enlace.jsx';

export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <span>{TEXTO_PIE}</span>
        <nav aria-label="Legal">
          {ENLACES_LEGALES.map((e) => <Enlace key={e.texto} href={e.ruta}>{e.texto}</Enlace>)}
        </nav>
      </div>
    </footer>
  );
}
