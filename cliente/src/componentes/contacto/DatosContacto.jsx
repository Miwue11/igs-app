import { DATOS_CONTACTO } from '../../constantes/contenido.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';

export function DatosContacto() {
  return (
    <section className="columna pila" aria-label="Dónde estamos">
      <div className="hueco mapa">[Mapa de localización]</div>
      <Tarjeta como="div" className="datos-contacto">
        {DATOS_CONTACTO.map((d) => (
          <div key={d.titulo}><h2>{d.titulo}</h2><p>{d.valor}</p></div>
        ))}
      </Tarjeta>
    </section>
  );
}
