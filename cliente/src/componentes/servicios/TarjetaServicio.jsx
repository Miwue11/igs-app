import { nombreCategoriaServicio, ventajasServicio } from '@compartido';
import { formatoPlazo, formatoPrecio, formatoValorMax } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { Insignia } from '../ui/Insignia.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Prioridad } from '../ui/Prioridad.jsx';

export function TarjetaServicio({ servicio, alSolicitar }) {
  return (
    <Tarjeta destacada={servicio.destacado} className="servicio">
      {servicio.destacado && <Insignia esquina>Más solicitado</Insignia>}
      <span className="servicio-categoria">{nombreCategoriaServicio(servicio.categoria)}</span>
      <h2>{servicio.nombre}</h2>
      <p>{servicio.descripcion}</p>
      <ul className="ventajas">
        {ventajasServicio(servicio).map((v) => <li key={v}>{v}</li>)}
      </ul>
      <dl className="servicio-datos">
        <div><dt>Plazo máximo</dt><dd>{formatoPlazo(servicio.plazoDias)}</dd></div>
        <div><dt>Prioridad en cola</dt><dd><Prioridad valor={servicio.prioridad} /></dd></div>
        <div><dt>Valor máx. por artículo</dt><dd>{formatoValorMax(servicio.valorMax)}</dd></div>
      </dl>
      <div className="servicio-pie">
        <p className="precio">
          {formatoPrecio(servicio.precio)}
          {servicio.precio != null && <small> / artículo</small>}
        </p>
        <Boton variante={servicio.destacado ? 'primario' : 'oscuro'} onClick={() => alSolicitar(servicio)}>Elegir este servicio</Boton>
      </div>
    </Tarjeta>
  );
}
