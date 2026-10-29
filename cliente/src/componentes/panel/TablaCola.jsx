import { ACCION_ESTADO, ESTADOS_PEDIDO } from '@compartido';
import { RUTAS } from '../../constantes/rutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { formatoFecha } from '../../utilidades/formato.js';
import { Estado } from '../ui/Estado.jsx';
import { Plazo } from '../ui/Plazo.jsx';
import { Prioridad } from '../ui/Prioridad.jsx';

const rutaSubir = (codigo) => `${RUTAS.PANEL}?seccion=subir&pedido=${codigo}`;

function AccionesPedido({ pedido, alAvanzar, ocupado }) {
  return (
    <div className="acciones-fila">
      {pedido.estado === ESTADOS_PEDIDO.EN_GRADEO && <Enlace href={rutaSubir(pedido.codigo)}>Subir productos</Enlace>}
      <button type="button" className="boton-enlace" disabled={ocupado} onClick={() => alAvanzar(pedido)}>
        {ACCION_ESTADO[pedido.estado]}
      </button>
    </div>
  );
}

/** Cola de trabajo: el número de la izquierda es la posición (urgencia del plazo → prioridad → llegada). */
export function TablaCola({ pedidos, alAvanzar, ocupado }) {
  if (pedidos.length === 0) return <p className="apagado">No hay pedidos con este estado.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-cola">
        <caption className="solo-lectores">Cola de pedidos por plazo, prioridad y orden de llegada</caption>
        <thead>
          <tr>
            <th>#</th><th>Pedido</th><th>Cliente</th><th>Servicio</th><th>Prioridad</th><th>Llegada</th><th>Publicar antes de</th><th>Uds.</th><th>Estado</th>
            <th><span className="solo-lectores">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, i) => (
            <tr key={p.codigo}>
              <td><strong>{i + 1}</strong></td>
              <td className="mono">{p.codigo}</td>
              <td>{p.cliente?.nombre}</td>
              <td>{p.servicio.nombre}</td>
              <td><Prioridad valor={p.servicio.prioridad} /></td>
              <td>{formatoFecha(p.fechaLlegada)}</td>
              <td><Plazo pedido={p} /></td>
              <td>{p.unidades}</td>
              <td><Estado valor={p.estado} /></td>
              <td><AccionesPedido pedido={p} alAvanzar={alAvanzar} ocupado={ocupado === p.codigo} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
