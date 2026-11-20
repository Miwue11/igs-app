import { useState } from 'react';
import { api } from '../servicios/index.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useSolicitarServicio } from '../hooks/useSolicitarServicio.js';
import { Enlace } from '../enrutador/Enlace.jsx';
import { RUTAS } from '../constantes/rutas.js';
import { FiltroCategorias, CATEGORIA_TODAS } from '../componentes/servicios/FiltroCategorias.jsx';
import { RejillaServicios } from '../componentes/servicios/RejillaServicios.jsx';
import { TablaComparativa } from '../componentes/servicios/TablaComparativa.jsx';
import { CalculadoraPedido } from '../componentes/servicios/CalculadoraPedido.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';

const NIVELES_COMPARADOS = ['STD', 'EXP', 'PRE'];

const filtrar = (servicios, categoria) =>
  categoria === CATEGORIA_TODAS ? servicios : servicios.filter((s) => s.categoria === categoria);

export function PaginaServicios() {
  useTituloPagina('Servicios');
  const [categoria, setCategoria] = useState(CATEGORIA_TODAS);
  const { datos: servicios, error, cargando } = useCarga(api.servicios.listar);
  const solicitar = useSolicitarServicio();
  const niveles = (servicios ?? []).filter((s) => NIVELES_COMPARADOS.includes(s.codigo));

  return (
    <div className="pagina">
      <div className="contenedor">
        <nav className="miga" aria-label="Ruta"><Enlace href={RUTAS.INICIO}>Inicio</Enlace> / Servicios</nav>
        <div className="pagina-cabecera">
          <h1>Servicios de gradeo</h1>
          <p>Todos los plazos cuentan desde que recibimos tu paquete. Express y Premium los acortan y pasan antes en la cola. Todos incluyen ficha pública verificable por ID, etiqueta con QR y código UV anti-réplica.</p>
        </div>
        <FiltroCategorias activa={categoria} alCambiar={setCategoria} />
        {cargando && <Cargando />}
        {error && <Aviso tipo="error">{error.message}</Aviso>}
        {servicios && <RejillaServicios servicios={filtrar(servicios, categoria)} alSolicitar={solicitar} />}
        {servicios && <TablaComparativa servicios={niveles} />}
        {servicios && <CalculadoraPedido servicios={servicios} alElegir={solicitar} />}
        <p className="aclaracion">Para hacer un pedido necesitas una cuenta. Si no has iniciado sesión, te llevaremos a <Enlace href={RUTAS.ACCEDER}>Acceder</Enlace>.</p>
      </div>
    </div>
  );
}
