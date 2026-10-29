import { formatoFecha, formatoPrecio } from '../../utilidades/formato.js';
import { Estado } from '../ui/Estado.jsx';
import { Plazo } from '../ui/Plazo.jsx';

const total = (p) => (p.servicio.precio == null ? null : p.servicio.precio * p.unidades);

/** Pedidos del cliente con su estado y la fecha máxima de publicación. */
export function ListaPedidos({ pedidos }) {
  if (pedidos.length === 0) return <p className="apagado">Todavía no has hecho ningún pedido.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="solo-lectores">Mis pedidos</caption>
        <thead>
          <tr><th>Pedido</th><th>Servicio</th><th>Uds.</th><th>Total</th><th>Fecha</th><th>Publicación como máximo</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.codigo}>
              <td className="mono">{p.codigo}</td>
              <td>{p.servicio.nombre}</td>
              <td>{p.unidades}</td>
              <td>{formatoPrecio(total(p))}</td>
              <td>{formatoFecha(p.creadoEn)}</td>
              <td><Plazo pedido={p} /></td>
              <td><Estado valor={p.estado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
