import { useEffect } from 'react';
import { useRutas } from './useRutas.js';

/** Cambia de ruta en cuanto se pinta (sustituye la entrada del historial). */
export function Redirigir({ a }) {
  const { navegar } = useRutas();
  useEffect(() => navegar(a, { reemplazar: true }), [a, navegar]);
  return null;
}
