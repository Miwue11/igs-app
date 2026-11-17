import { Fragment } from 'react';
import { ESTADOS_ARTICULO, ETIQUETAS_ESTADO_ARTICULO, resumenArticulos } from '@compartido';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { rutaConsulta } from '../../constantes/rutas.js';
import { formatoFecha, formatoPrecio } from '../../utilidades/formato.js';
import { Estado } from '../ui/Estado.jsx';
import { Plazo } from '../ui/Plazo.jsx';

/** Pedidos antiguos sin importe guardado: se calcula con el precio del servicio. */
const total = (p) => p.importe?.total ?? (p.servicio.precio == null ? null : p.servicio.precio * p.unidades);

function ResultadoArticulo({ articulo }) {
  if (articulo.estado === ESTADOS_ARTICULO.GRADEADO) {
    return <Enlace href={rutaConsulta(articulo.idCertificado)} className="mono">{articulo.idCertificado}</Enlace>;
  }
  if (articulo.estado === ESTADOS_ARTICULO.NO_GRADEABLE) {
    return <span>{ETIQUETAS_ESTADO_ARTICULO[articulo.estado]}: {articulo.motivo}</span>;
  }
  return <span className="apagado">{ETIQUETAS_ESTADO_ARTICULO[articulo.estado]}</span>;
}

/** Detalle desplegable con lo que declaró el cliente y el resultado de cada artículo. */
function DetalleArticulos({ pedido }) {
  const { total: cuantos, resueltos } = resumenArticulos(pedido);
  return (
    <details className="detalle-articulos">
      <summary>Ver {cuantos} artículos ({resueltos} resueltos)</summary>
      <ol>
        {pedido.articulos.map((a, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>
            <span>
              <strong>{a.nombre}</strong>
              {[a.expansion, a.anio, a.numero].filter(Boolean).length > 0 && ` · ${[a.expansion, a.anio, a.numero].filter(Boolean).join(' · ')}`}
              {' · '}declarado {formatoPrecio(a.valorDeclarado)}
            </span>
            <ResultadoArticulo articulo={a} />
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Pedidos del cliente con su estado, importe y el resultado de cada artículo. */
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
            <Fragment key={p.codigo}>
              <tr>
                <td className="mono">{p.codigo}</td>
                <td>{p.servicio.nombre}</td>
                <td>{p.unidades}</td>
                <td>{formatoPrecio(total(p))}</td>
                <td>{formatoFecha(p.creadoEn)}</td>
                <td><Plazo pedido={p} /></td>
                <td><Estado valor={p.estado} /></td>
              </tr>
              {p.articulos?.length > 0 && (
                <tr className="fila-detalle"><td colSpan={7}><DetalleArticulos pedido={p} /></td></tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
