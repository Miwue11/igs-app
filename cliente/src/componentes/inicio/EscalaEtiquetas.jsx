import { EtiquetaIGS } from '../producto/EtiquetaIGS.jsx';

const EJEMPLO = { nombre: 'Marshadow & Machamp GX', anio: 2019, expansion: 'Double Blaze', idCertificado: 'IGS-2026-000001' };
const PERFECTAS = { centrado: 10, esquinas: 10, bordes: 10, superficie: 10 };

const NIVELES = [
  {
    producto: { ...EJEMPLO, nota: 10, subnotas: PERFECTAS },
    titulo: '10 · PRISTINE (rojo metálico)',
    texto: 'Solo cuando el centrado, las esquinas, los bordes y la superficie obtienen un 10. Es la máxima distinción de IGS.',
  },
  {
    producto: { ...EJEMPLO, nota: 10, idCertificado: 'IGS-2026-000002' },
    titulo: '10 y 9,5 · GEM MINT (dorado)',
    texto: 'Producto en estado de gema: cualquier defecto solo se aprecia con aumento.',
  },
  {
    producto: { ...EJEMPLO, nota: 9, idCertificado: 'IGS-2026-000003' },
    titulo: 'Del 9 hacia abajo (plateado)',
    texto: 'De 9 · MINT a 1 · POOR. El nombre del grado aparece siempre bajo la nota.',
  },
];

/** Explica los tres colores del distintivo de la etiqueta IGS. */
export function EscalaEtiquetas() {
  return (
    <section className="seccion" aria-labelledby="t-etiquetas">
      <div className="contenedor">
        <div className="escala-intro">
          <h2 id="t-etiquetas" className="seccion-titulo">Nuestra etiqueta</h2>
          <p className="aclaracion">
            Cada producto gradeado lleva una etiqueta con el año, la expansión, el nombre, el número de certificado y el grado.
            El color del distintivo indica el nivel de la nota.
          </p>
        </div>
        <div className="escala-etiquetas">
          {NIVELES.map((n) => (
            <figure key={n.titulo}>
              <EtiquetaIGS producto={n.producto} />
              <figcaption><strong>{n.titulo}</strong><span>{n.texto}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
