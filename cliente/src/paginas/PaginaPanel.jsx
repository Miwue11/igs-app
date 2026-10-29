import { SECCIONES_PANEL, SECCION_PANEL_INICIAL } from '../constantes/navegacion.js';
import { useSesion } from '../hooks/useSesion.js';
import { useRutas } from '../enrutador/useRutas.js';
import { SeccionCola } from './panel/SeccionCola.jsx';
import { SeccionSubir } from './panel/SeccionSubir.jsx';
import { SeccionTickets } from './panel/SeccionTickets.jsx';
import { SeccionUsuarios } from './panel/SeccionUsuarios.jsx';
import { PaginaSinPermiso } from './PaginaSinPermiso.jsx';

const COMPONENTES = { cola: SeccionCola, subir: SeccionSubir, tickets: SeccionTickets, usuarios: SeccionUsuarios };

/** Panel interno: pinta la sección indicada en ?seccion= si el rol la permite. */
export function PaginaPanel() {
  const { query } = useRutas();
  const { usuario } = useSesion();
  const id = query.get('seccion') ?? SECCION_PANEL_INICIAL;
  const seccion = SECCIONES_PANEL.find((s) => s.id === id) ?? SECCIONES_PANEL[0];

  if (!seccion.roles.includes(usuario.rol)) return <PaginaSinPermiso />;
  const Seccion = COMPONENTES[seccion.id];
  return <Seccion />;
}
