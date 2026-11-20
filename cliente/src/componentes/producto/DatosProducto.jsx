import { nombreCategoria } from '@compartido';

/** Campos de la ficha, en el orden en que se muestran. */
const CAMPOS = [
  ['Marca / juego', (p) => p.marca],
  ['Año', (p) => p.anio],
  ['Expansión', (p) => p.expansion],
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
