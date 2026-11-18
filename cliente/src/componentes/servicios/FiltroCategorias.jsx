import { CATEGORIAS_SERVICIO } from '@compartido';

const TODAS = { id: 'todas', nombre: 'Todos' };

/** Botones para filtrar servicios por categoría. */
export function FiltroCategorias({ activa, alCambiar }) {
  return (
    <div className="filtros" role="group" aria-label="Filtrar por categoría">
      {[TODAS, ...CATEGORIAS_SERVICIO].map((c) => (
        <button key={c.id} type="button" className="filtro" aria-pressed={activa === c.id} onClick={() => alCambiar(c.id)}>
          {c.nombre}
        </button>
      ))}
    </div>
  );
}

export const CATEGORIA_TODAS = TODAS.id;
