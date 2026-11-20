import { createContext, useCallback, useMemo, useSyncExternalStore } from 'react';
import { conBase, sinBase } from './base.js';

/**
 * Enrutador ligero basado en la History API (sin dependencias).
 * Guarda la URL actual y permite navegar sin recargar la página.
 */
export const ContextoRutas = createContext(null);

const EVENTO_NAVEGAR = 'igs:navegar';

const suscribir = (aviso) => {
  window.addEventListener('popstate', aviso);
  window.addEventListener(EVENTO_NAVEGAR, aviso);
  return () => {
    window.removeEventListener('popstate', aviso);
    window.removeEventListener(EVENTO_NAVEGAR, aviso);
  };
};

const urlActual = () => sinBase(window.location.pathname) + window.location.search;

export function ProveedorRutas({ children }) {
  const url = useSyncExternalStore(suscribir, urlActual);

  /** Navega sin recargar. Con «#ancla» baja hasta ese elemento cuando la página nueva ya está pintada. */
  const navegar = useCallback((destino, { reemplazar = false } = {}) => {
    const [url, ancla] = destino.split('#');
    if (url !== urlActual()) {
      window.history[reemplazar ? 'replaceState' : 'pushState'](null, '', conBase(destino));
      window.dispatchEvent(new Event(EVENTO_NAVEGAR));
    }
    if (!ancla) { window.scrollTo(0, 0); return; }
    window.setTimeout(() => document.getElementById(ancla)?.scrollIntoView({ block: 'start' }), 60);
  }, []);

  const valor = useMemo(() => {
    const [ruta, busqueda = ''] = url.split('?');
    return { ruta, query: new URLSearchParams(busqueda), navegar };
  }, [url, navegar]);

  return <ContextoRutas.Provider value={valor}>{children}</ContextoRutas.Provider>;
}
