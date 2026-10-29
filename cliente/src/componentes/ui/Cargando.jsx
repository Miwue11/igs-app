/** Indicador de carga accesible. */
export function Cargando({ texto = 'Cargando…' }) {
  return <p className="cargando" role="status" aria-live="polite">{texto}</p>;
}
