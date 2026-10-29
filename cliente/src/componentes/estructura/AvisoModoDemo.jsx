import { CONFIGURACION } from '../../constantes/configuracion.js';

/** Franja superior que recuerda que los datos son de ejemplo (solo en modo demo). */
export function AvisoModoDemo() {
  if (!CONFIGURACION.MODO_DEMO) return null;
  return <div className="barra-demo" role="note">Modo demo · los datos son de ejemplo y se pierden al recargar</div>;
}
