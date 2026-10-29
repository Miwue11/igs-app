import { createContext, useCallback, useMemo, useSyncExternalStore } from 'react';

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

const urlActual = () => window.location.pathname + window.location.search;

export function ProveedorRutas({ children }) {
  const url = useSyncExternalStore(suscribir, urlActual);

  const navegar = useCallback((destino, { reemplazar = false } = {}) => {
    if (destino === urlActual()) return;
    window.history[reemplazar ? 'replaceState' : 'pushState'](null, '', destino);
    window.dispatchEvent(new Event(EVENTO_NAVEGAR));
    window.scrollTo(0, 0);
  }, []);

  const valor = useMemo(() => {
    const [ruta, busqueda = ''] = url.split('?');
    return { ruta, query: new URLSearchParams(busqueda), navegar };
  }, [url, navegar]);

  return <ContextoRutas.Provider value={valor}>{children}</ContextoRutas.Provider>;
}
