import { DATOS_CONTACTO } from '../../constantes/contenido.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';

export function DatosContacto() {
  return (
    <section className="columna pila" aria-label="Datos de contacto">
      <Tarjeta como="div" className="datos-contacto">
        {DATOS_CONTACTO.map((d) => (
          <div key={d.titulo}>
            <h2>{d.titulo}</h2>
            <p>{d.enlace ? <a href={d.enlace}>{d.valor}</a> : d.valor.split('\n').map((l) => <span key={l}>{l}<br /></span>)}</p>
          </div>
        ))}
      </Tarjeta>
      <Tarjeta como="div" className="nota-contacto">
        <h2>Tiempo de respuesta</h2>
        <p>Respondemos los tickets en menos de 24 horas laborables. Si es sobre un pedido, indica su código (PED-…) para ir más rápido.</p>
      </Tarjeta>
    </section>
  );
}
