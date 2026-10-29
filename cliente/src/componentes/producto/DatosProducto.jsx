import { nombreCategoria } from '@compartido';
import { formatoNota } from '../../utilidades/formato.js';

/** Campos de la ficha, en el orden en que se muestran. */
const CAMPOS = [
  ['ID', (p) => p.idCertificado],
  ['Grado', (p) => `${formatoNota(p.nota)} · ${p.etiquetaGrado}`],
  ['Marca', (p) => p.marca],
  ['Clase', (p) => p.clase],
  ['Nº de tarjeta', (p) => p.numeroTarjeta],
  ['Categoría', (p) => nombreCategoria(p.categoria)],
  ['Variedad', (p) => p.variedad],
  ['Idioma', (p) => p.idioma],
];

export function DatosProducto({ producto }) {
  return (
    <dl className="lista-datos">
      {CAMPOS.map(([titulo, leer]) => (
        <div key={titulo}>
          <dt>{titulo}</dt>
          <dd>{leer(producto) || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
