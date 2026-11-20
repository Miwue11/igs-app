import { RUTAS, rutaAcceder } from '../constantes/rutas.js';
import { useRutas } from '../enrutador/useRutas.js';
import { useSesion } from './useSesion.js';

/** Lleva al formulario de pedido con el servicio ya elegido; sin sesión pasa antes por Acceder. */
export const useSolicitarServicio = () => {
  const { usuario } = useSesion();
  const { navegar } = useRutas();
  return (servicio) => {
    const destino = `${RUTAS.MI_CUENTA}?servicio=${servicio.codigo}#nuevo-pedido`;
    navegar(usuario ? destino : rutaAcceder(destino.split('#')[0]));
  };
};
