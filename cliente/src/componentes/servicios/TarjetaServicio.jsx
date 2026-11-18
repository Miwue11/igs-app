import { nombreCategoriaServicio, ventajasServicio } from '@compartido';
import { formatoPlazo, formatoPrecio, formatoValorMax } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { Insignia } from '../ui/Insignia.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Prioridad } from '../ui/Prioridad.jsx';

export function TarjetaServicio({ servicio, alSolicitar }) {
  return (
    <Tarjeta destacada={servicio.destacado} className="servicio">
      <div className="servicio-cabecera">
        <span className="servicio-categoria">{nombreCategoriaServicio(servicio.categoria)}</span>
        {servicio.destacado && <Insignia>Más solicitado</Insignia>}
      </div>
      <h2>{servicio.nombre}</h2>
      <p>{servicio.descripcion}</p>
      <ul className="ventajas">
        {ventajasServicio(servicio).map((v) => <li key={v}>{v}</li>)}
      </ul>
      <dl className="servicio-datos">
        <div><dt>Publicado en</dt><dd>{formatoPlazo(servicio.plazoDias)} máx. desde que llega tu paquete</dd></div>
        <div><dt>Prioridad en cola</dt><dd><Prioridad valor={servicio.prioridad} /></dd></div>
        <div><dt>Valor declarado máx.</dt><dd>{formatoValorMax(servicio.valorMax)}</dd></div>
      </dl>
      <div className="servicio-pie">
        <strong>{formatoPrecio(servicio.precio)}</strong>
        <Boton variante="oscuro" onClick={() => alSolicitar(servicio)}>Elegir este servicio</Boton>
      </div>
    </Tarjeta>
  );
}
