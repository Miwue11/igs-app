import { useRutas } from './useRutas.js';
import { Redirigir } from './Redirigir.jsx';
import { TABLA_RUTAS } from './tablaRutas.js';
import { rutaAcceder } from '../constantes/rutas.js';
import { useSesion } from '../hooks/useSesion.js';
import { PlantillaPublica } from '../componentes/estructura/PlantillaPublica.jsx';
import { PlantillaPanel } from '../componentes/estructura/PlantillaPanel.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';
import { PaginaNoEncontrada } from '../paginas/PaginaNoEncontrada.jsx';
import { PaginaSinPermiso } from '../paginas/PaginaSinPermiso.jsx';

const PLANTILLAS = { publica: PlantillaPublica, panel: PlantillaPanel };

const puedeEntrar = (roles, usuario) => roles === null || (usuario && (roles.length === 0 || roles.includes(usuario.rol)));

/** Elige la página según la URL y aplica el control de acceso por rol. */
export function Rutas() {
  const { ruta } = useRutas();
  const { usuario, cargando } = useSesion();
  const destino = TABLA_RUTAS.find((r) => r.ruta === ruta);

  if (!destino) return <PlantillaPublica><PaginaNoEncontrada /></PlantillaPublica>;

  const { Pagina, plantilla, roles } = destino;
  const Plantilla = PLANTILLAS[plantilla];

  if (roles !== null && cargando) return <PlantillaPublica><Cargando /></PlantillaPublica>;
  if (roles !== null && !usuario) return <Redirigir a={rutaAcceder(ruta)} />;
  if (!puedeEntrar(roles, usuario)) return <PlantillaPublica><PaginaSinPermiso /></PlantillaPublica>;

  return <Plantilla><Pagina /></Plantilla>;
}
