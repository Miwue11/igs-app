import { RUTAS } from '../../constantes/rutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { formatoPlazo, formatoPrecio } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { Insignia } from '../ui/Insignia.jsx';
import { Boton } from '../ui/Boton.jsx';

function TarjetaResumen({ servicio }) {
  return (
    <Tarjeta destacada={servicio.destacado}>
      {servicio.destacado && <Insignia>Más solicitado</Insignia>}
      <h3>{servicio.nombre}</h3>
      <p className="apagado">Publicado en {formatoPlazo(servicio.plazoDias)} como máximo</p>
      <p className="precio">
        {formatoPrecio(servicio.precio)}
        {servicio.precio != null && <small> / producto</small>}
      </p>
      <Boton href={RUTAS.SERVICIOS} variante={servicio.destacado ? 'primario' : 'contorno'}>Ver detalle</Boton>
    </Tarjeta>
  );
}

export function ResumenServicios({ servicios }) {
  return (
    <section className="seccion-ajustada" aria-labelledby="titulo-servicios">
      <div className="contenedor">
        <div className="seccion-cabecera">
          <h2 className="seccion-titulo" id="titulo-servicios">Servicios de gradeo</h2>
          <Enlace href={RUTAS.SERVICIOS}><strong>Ver todos los servicios</strong></Enlace>
        </div>
        <div className="precios">
          {servicios.map((s) => <TarjetaResumen key={s.codigo} servicio={s} />)}
        </div>
      </div>
    </section>
  );
}
