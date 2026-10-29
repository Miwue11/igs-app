import { useState } from 'react';
import { api } from '../servicios/index.js';
import { useCarga } from '../hooks/useCarga.js';
import { useSesion } from '../hooks/useSesion.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { Enlace } from '../enrutador/Enlace.jsx';
import { RUTAS, rutaAcceder } from '../constantes/rutas.js';
import { FiltroCategorias, CATEGORIA_TODAS } from '../componentes/servicios/FiltroCategorias.jsx';
import { RejillaServicios } from '../componentes/servicios/RejillaServicios.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';

const filtrar = (servicios, categoria) =>
  categoria === CATEGORIA_TODAS ? servicios : servicios.filter((s) => s.categoria === categoria);

export function PaginaServicios() {
  useTituloPagina('Servicios');
  const [categoria, setCategoria] = useState(CATEGORIA_TODAS);
  const { datos: servicios, error, cargando } = useCarga(api.servicios.listar);
  const { usuario } = useSesion();
  const { navegar } = useRutas();

  /** Sin sesión se pasa por el entrar y luego se vuelve al formulario de pedido. */
  const solicitar = (servicio) => {
    const destino = `${RUTAS.MI_CUENTA}?servicio=${servicio.codigo}`;
    navegar(usuario ? destino : rutaAcceder(destino));
  };

  return (
    <div className="pagina">
      <div className="contenedor">
        <nav className="miga" aria-label="Ruta"><Enlace href={RUTAS.INICIO}>Inicio</Enlace> / Servicios</nav>
        <div className="pagina-cabecera">
          <h1>Servicios de gradeo</h1>
          <p>El gradeo básico se publica en 14 días como máximo desde que haces el pedido. Los servicios superiores reducen el plazo y pasan antes en la cola. Todos incluyen ficha pública verificable por ID.</p>
        </div>
        <FiltroCategorias activa={categoria} alCambiar={setCategoria} />
        {cargando && <Cargando />}
        {error && <Aviso tipo="error">{error.message}</Aviso>}
        {servicios && <RejillaServicios servicios={filtrar(servicios, categoria)} alSolicitar={solicitar} />}
        <p className="aclaracion">Para solicitar un servicio necesitas una cuenta. Si no has iniciado sesión, te llevaremos a <Enlace href={RUTAS.ACCEDER}>Acceder</Enlace>.</p>
      </div>
    </div>
  );
}
