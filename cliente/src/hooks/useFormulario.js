import { useState } from 'react';
import { validarCon, sinErrores } from '@compartido';
import { ErrorApi } from '../servicios/index.js';

const valorDelCampo = ({ type, checked, value }) => (type === 'checkbox' ? checked : value);

const enfocarPrimerError = (formulario, errores) => {
  const campo = Object.keys(errores)[0];
  formulario?.querySelector(`[name="${campo}"]`)?.focus();
};

/**
 * Estado de un formulario: valores, errores por campo y mensaje general.
 * Valida con el mismo esquema que usa el servidor y muestra los errores que devuelva la API.
 *   esquema: nombre del esquema compartido (o null)
 *   alEnviar: async (valores) => texto de éxito opcional
 */
export function useFormulario({ inicial, esquema = null, alEnviar, preparar = (v) => v }) {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const asignar = (campo, valor) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setErrores(({ [campo]: _quitado, ...resto }) => resto);
  };

  const cambiar = (e) => asignar(e.target.name, valorDelCampo(e.target));

  const enviar = async (e) => {
    e.preventDefault();
    const datos = preparar(valores);
    const nuevos = esquema ? validarCon(esquema, datos) : {};
    setErrores(nuevos);
    if (!sinErrores(nuevos)) {
      setMensaje({ tipo: 'error', texto: 'Revisa los campos marcados.' });
      enfocarPrimerError(e.currentTarget, nuevos);
      return;
    }
    setEnviando(true);
    setMensaje(null);
    try {
      const texto = await alEnviar(datos);
      if (texto) setMensaje({ tipo: 'ok', texto });
    } catch (error) {
      if (error instanceof ErrorApi && error.detalles) setErrores(error.detalles);
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  /** Rellena varios campos a la vez (p. ej. con lo que lee la IA) y limpia sus errores. */
  const rellenar = (nuevos) => {
    setValores((previos) => ({ ...previos, ...nuevos }));
    setErrores((previos) => Object.fromEntries(Object.entries(previos).filter(([campo]) => !(campo in nuevos))));
    setMensaje(null);
  };

  const reiniciar = (nuevos = inicial) => {
    setValores(nuevos);
    setErrores({});
  };

  return { valores, errores, mensaje, enviando, cambiar, asignar, rellenar, enviar, reiniciar, setMensaje };
}
