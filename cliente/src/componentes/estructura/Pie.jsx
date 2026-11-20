import { COLUMNAS_PIE, ENLACES_LEGALES } from '../../constantes/navegacion.js';
import { TEXTO_PIE } from '../../constantes/contenido.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { Logo } from '../ui/Logo.jsx';

/** Pie con la marca, el compromiso de plazo, enlaces por tema y la información legal. */
export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor pie-columnas">
        <div className="pie-marca">
          <Logo />
          <p>Gradeo profesional de cartas y cómics con plazo garantizado: 14 días desde que recibimos tu paquete.</p>
        </div>
        {COLUMNAS_PIE.map((columna) => (
          <nav key={columna.titulo} aria-label={columna.titulo} className="pie-columna">
            <h2>{columna.titulo}</h2>
            <ul>
              {columna.enlaces.map((e) => <li key={e.texto}><Enlace href={e.ruta}>{e.texto}</Enlace></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="contenedor pie-legal">
        <span>{TEXTO_PIE}</span>
        <nav aria-label="Legal">
          {ENLACES_LEGALES.map((e) => <Enlace key={e.texto} href={e.ruta}>{e.texto}</Enlace>)}
        </nav>
      </div>
    </footer>
  );
}
