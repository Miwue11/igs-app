import { formatoPlazo, formatoPrecio, formatoValorMax } from '../../utilidades/formato.js';
import { Prioridad } from '../ui/Prioridad.jsx';
import { Icono } from '../ui/Icono.jsx';

const Si = () => <span className="comparativa-si"><Icono nombre="check" tamano={18} /><span className="solo-lectores">Sí</span></span>;
const No = () => <span className="apagado" aria-label="No">—</span>;

const FILAS = [
  { titulo: 'Precio por artículo', valor: (s) => formatoPrecio(s.precio) },
  { titulo: 'Plazo máximo desde que llega el paquete', valor: (s) => formatoPlazo(s.plazoDias) },
  { titulo: 'Prioridad en la cola', valor: (s) => <Prioridad valor={s.prioridad} /> },
  { titulo: 'Valor declarado máximo por artículo', valor: (s) => formatoValorMax(s.valorMax) },
  { titulo: 'Revisión por dos gradeadores', valor: (s) => (s.extras?.includes('Doble revisión') ? <Si /> : <No />) },
  { titulo: 'Ficha pública, QR y código UV', valor: () => <Si /> },
];

/** Comparación lado a lado de los niveles de gradeo de cartas. */
export function TablaComparativa({ servicios }) {
  if (servicios.length < 2) return null;
  return (
    <section className="comparativa" aria-labelledby="t-comparativa">
      <h2 className="seccion-titulo" id="t-comparativa">Compara los niveles</h2>
      <div className="tabla-contenedor">
        <table className="tabla tabla-comparativa">
          <caption className="solo-lectores">Comparación de los servicios de gradeo de cartas</caption>
          <thead>
            <tr><th scope="col"><span className="solo-lectores">Característica</span></th>
              {servicios.map((s) => <th key={s.codigo} scope="col" className={s.destacado ? 'destacada' : undefined}>{s.nombre}</th>)}
            </tr>
          </thead>
          <tbody>
            {FILAS.map((f) => (
              <tr key={f.titulo}>
                <th scope="row">{f.titulo}</th>
                {servicios.map((s) => <td key={s.codigo} className={s.destacado ? 'destacada' : undefined}>{f.valor(s)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
