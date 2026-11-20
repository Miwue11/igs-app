import { PREGUNTAS_FRECUENTES } from '../../constantes/contenido.js';

/** Preguntas frecuentes desplegables (details/summary: accesibles con teclado sin JavaScript extra). */
export function PreguntasFrecuentes({ titulo = 'Preguntas frecuentes', id = 'preguntas', limite }) {
  const preguntas = limite ? PREGUNTAS_FRECUENTES.slice(0, limite) : PREGUNTAS_FRECUENTES;
  return (
    <section className="preguntas" aria-labelledby={`t-${id}`} id={id}>
      <h2 className="seccion-titulo" id={`t-${id}`}>{titulo}</h2>
      <div className="preguntas-lista">
        {preguntas.map((p) => (
          <details key={p.pregunta}>
            <summary>{p.pregunta}</summary>
            <p>{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
