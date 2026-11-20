import { api } from '../servicios/index.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { rutaConsulta } from '../constantes/rutas.js';
import { SERVICIOS_PORTADA } from '../constantes/contenido.js';
import { Portada } from '../componentes/inicio/Portada.jsx';
import { FranjaConfianza } from '../componentes/inicio/FranjaConfianza.jsx';
import { PasosProceso } from '../componentes/inicio/PasosProceso.jsx';
import { EscalaEtiquetas } from '../componentes/inicio/EscalaEtiquetas.jsx';
import { ResumenServicios } from '../componentes/inicio/ResumenServicios.jsx';
import { AvisoVerificar } from '../componentes/inicio/AvisoVerificar.jsx';
import { PreguntasFrecuentes } from '../componentes/comun/PreguntasFrecuentes.jsx';

const deLaPortada = (servicios = []) =>
  SERVICIOS_PORTADA.map((codigo) => servicios.find((s) => s.codigo === codigo)).filter(Boolean);

export function PaginaInicio() {
  useTituloPagina(null);
  const { navegar } = useRutas();
  const { datos: servicios } = useCarga(api.servicios.listar);

  return (
    <>
      <Portada alBuscar={(id) => navegar(rutaConsulta(id))} />
      <FranjaConfianza />
      <PasosProceso />
      <EscalaEtiquetas />
      {servicios && <ResumenServicios servicios={deLaPortada(servicios)} />}
      <section className="seccion-ajustada">
        <div className="contenedor"><PreguntasFrecuentes id="preguntas-inicio" limite={4} /></div>
      </section>
      <AvisoVerificar />
    </>
  );
}
