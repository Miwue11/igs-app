import { useEffect } from 'react';

const SUFIJO = 'IGS · Iberian Grading Services';

/** Cambia el título de la pestaña del navegador. */
export const useTituloPagina = (titulo) => {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${SUFIJO}` : SUFIJO;
  }, [titulo]);
};
