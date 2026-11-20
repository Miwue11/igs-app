import { RUTAS } from '../../constantes/rutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { useSolicitarServicio } from '../../hooks/useSolicitarServicio.js';
import { formatoPlazo, formatoPrecio } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { Insignia } from '../ui/Insignia.jsx';
import { Boton } from '../ui/Boton.jsx';

function TarjetaResumen({ servicio, alElegir }) {
  return (
    <Tarjeta destacada={servicio.destacado} className="tarjeta-resumen">
      {servicio.destacado && <Insignia esquina>Más solicitado</Insignia>}
      <h3>{servicio.nombre}</h3>
      <p className="precio">
        {formatoPrecio(servicio.precio)}
        {servicio.precio != null && <small> / artículo</small>}
      </p>
      <p className="apagado">Publicado en {formatoPlazo(servicio.plazoDias)} como máximo desde que llega tu paquete.</p>
      <Boton variante={servicio.destacado ? 'primario' : 'contorno'} onClick={() => alElegir(servicio)}>
        Elegir {servicio.nombre.replace('Gradeo ', '')}
      </Boton>
    </Tarjeta>
  );
}

export function ResumenServicios({ servicios }) {
  const solicitar = useSolicitarServicio();
  return (
    <section className="seccion-ajustada" aria-labelledby="titulo-servicios">
      <div className="contenedor">
        <div className="seccion-cabecera">
          <h2 className="seccion-titulo" id="titulo-servicios">Servicios de gradeo</h2>
          <Enlace href={RUTAS.SERVICIOS}><strong>Comparar todos los servicios</strong></Enlace>
        </div>
        <div className="precios">
          {servicios.map((s) => <TarjetaResumen key={s.codigo} servicio={s} alElegir={solicitar} />)}
        </div>
      </div>
    </section>
  );
}
