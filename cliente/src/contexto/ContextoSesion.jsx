import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../servicios/index.js';

/** Estado global de la sesión: quién ha entrado y acciones para entrar o salir. */
export const ContextoSesion = createContext(null);

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.acceso.yo().then(setUsuario).catch(() => setUsuario(null)).finally(() => setCargando(false));
  }, []);

  const entrar = useCallback(async (datos) => {
    const nuevo = await api.acceso.entrar(datos);
    setUsuario(nuevo);
    return nuevo;
  }, []);

  const registrarse = useCallback(async (datos) => {
    const nuevo = await api.acceso.registro(datos);
    setUsuario(nuevo);
    return nuevo;
  }, []);

  const salir = useCallback(async () => {
    await api.acceso.salir().catch(() => null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, entrar, registrarse, salir }),
    [usuario, cargando, entrar, registrarse, salir],
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}
