import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ejecuta una función asíncrona (normalmente una llamada a la API) y guarda
 * su resultado, error y estado de carga. Se repite cuando cambian las dependencias.
 */
export function useCarga(funcion, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, error: null, cargando: true });
  const ultimaPeticion = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recargar = useCallback(async () => {
    const id = (ultimaPeticion.current += 1);
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));
    try {
      const datos = await funcion();
      if (id === ultimaPeticion.current) setEstado({ datos, error: null, cargando: false });
    } catch (error) {
      if (id === ultimaPeticion.current) setEstado({ datos: null, error, cargando: false });
    }
  }, dependencias);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const cambiarDatos = useCallback((cambio) => {
    setEstado((previo) => ({ ...previo, datos: typeof cambio === 'function' ? cambio(previo.datos) : cambio }));
  }, []);

  return { ...estado, recargar, cambiarDatos };
}
