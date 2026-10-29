import { SECCION_PANEL_INICIAL } from '../../constantes/navegacion.js';
import { useRutas } from '../../enrutador/useRutas.js';
import { BarraLateral } from './BarraLateral.jsx';

/** Estructura del panel interno: menú lateral + contenido. */
export function PlantillaPanel({ children }) {
  const { query } = useRutas();
  return (
    <div className="aplicacion">
      <BarraLateral seccionActiva={query.get('seccion') ?? SECCION_PANEL_INICIAL} />
      <main className="aplicacion-principal" id="contenido">{children}</main>
    </div>
  );
}
