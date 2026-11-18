import { Boton } from '../ui/Boton.jsx';

export const ARTICULO_VACIO = Object.freeze({
  nombre: '', marca: '', expansion: '', anio: '', numero: '', idioma: '', rareza: '', valorDeclarado: '',
});

const COLUMNAS = [
  { campo: 'nombre', titulo: 'Nombre', ancho: 'ancho' },
  { campo: 'expansion', titulo: 'Expansión / colección' },
  { campo: 'anio', titulo: 'Año', modo: 'numeric', corto: true },
  { campo: 'numero', titulo: 'Número', corto: true },
];

/** Tabla editable con los artículos que el cliente declara en su pedido. */
export function ListaArticulos({ articulos, alCambiar, valorMax }) {
  const cambiar = (indice, campo, valor) =>
    alCambiar(articulos.map((a, i) => (i === indice ? { ...a, [campo]: valor } : a)));
  const quitar = (indice) => alCambiar(articulos.filter((_, i) => i !== indice));

  if (articulos.length === 0) {
    return <p className="apagado">Todavía no has añadido artículos. Búscalos arriba o añádelos a mano.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-articulos">
        <caption className="solo-lectores">Artículos que vas a enviar</caption>
        <thead>
          <tr>
            <th>#</th>
            {COLUMNAS.map((c) => <th key={c.campo}>{c.titulo}</th>)}
            <th>Valor declarado (€)</th>
            <th><span className="solo-lectores">Quitar</span></th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a, i) => {
            const caro = valorMax != null && Number(a.valorDeclarado) > valorMax;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={i}>
                <td>{i + 1}</td>
                {COLUMNAS.map((c) => (
                  <td key={c.campo}>
                    <input className={c.corto ? 'entrada entrada-corta' : 'entrada'} value={a[c.campo]} inputMode={c.modo}
                      aria-label={`${c.titulo} del artículo ${i + 1}`} onChange={(e) => cambiar(i, c.campo, e.target.value)} />
                  </td>
                ))}
                <td>
                  <input className="entrada entrada-corta" type="number" min="1" step="1" value={a.valorDeclarado}
                    aria-label={`Valor declarado del artículo ${i + 1} en euros`} aria-invalid={caro || undefined}
                    onChange={(e) => cambiar(i, 'valorDeclarado', e.target.value)} />
                  {caro && <p className="campo-error">Supera {valorMax} €</p>}
                </td>
                <td>
                  <Boton variante="contorno" onClick={() => quitar(i)} aria-label={`Quitar el artículo ${i + 1}`}>Quitar</Boton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
