import { PASOS_PROCESO } from '../../constantes/contenido.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';

export function PasosProceso() {
  return (
    <section className="seccion" aria-labelledby="titulo-pasos">
      <div className="contenedor">
        <h2 className="seccion-titulo" id="titulo-pasos">Cómo funciona</h2>
        <ol className="pasos">
          {PASOS_PROCESO.map((paso) => (
            <Tarjeta como="li" key={paso.numero}>
              <span className="paso-numero">{paso.numero}</span>
              <h3>{paso.titulo}</h3>
              <p className="apagado">{paso.texto}</p>
            </Tarjeta>
          ))}
        </ol>
      </div>
    </section>
  );
}
