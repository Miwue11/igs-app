import { useState } from 'react';
import { CONFIGURACION } from '../../constantes/configuracion.js';

const CLAVE = 'igs-demo-aviso-cerrado';

const leerCerrado = () => {
  try {
    return sessionStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
};

/** Franja superior que recuerda que los datos son de ejemplo (solo en modo demo). Se puede cerrar. */
export function AvisoModoDemo() {
  const [cerrado, setCerrado] = useState(leerCerrado);
  if (!CONFIGURACION.MODO_DEMO || cerrado) return null;

  const cerrar = () => {
    setCerrado(true);
    try { sessionStorage.setItem(CLAVE, '1'); } catch { /* sin almacenamiento: vuelve al recargar */ }
  };

  return (
    <div className="barra-demo" role="note">
      <span>Demo · datos de ejemplo<span className="barra-demo-extra"> que se pierden al recargar</span></span>
      <button type="button" className="barra-demo-cerrar" onClick={cerrar} aria-label="Cerrar aviso de demo">×</button>
    </div>
  );
}
