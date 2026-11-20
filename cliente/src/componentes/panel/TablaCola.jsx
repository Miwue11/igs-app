import { Fragment, useState } from 'react';
import {
  ACCION_ESTADO, ESTADOS_PEDIDO, ETIQUETAS_ESTADO_ARTICULO, ETIQUETAS_ESTADO_PEDIDO, resumenArticulos,
} from '@compartido';
import { RUTAS } from '../../constantes/rutas.js';
import { formatoFecha, formatoPrecio } from '../../utilidades/formato.js';
import { Boton } from '../ui/Boton.jsx';
import { Estado } from '../ui/Estado.jsx';
import { Plazo } from '../ui/Plazo.jsx';
import { Prioridad } from '../ui/Prioridad.jsx';

const rutaSubir = (codigo) => `${RUTAS.PANEL}?seccion=subir&pedido=${codigo}`;

/** Una acción principal por fila: en gradeo es gradear; si ya está todo resuelto, publicar. */
function AccionesPedido({ pedido, alAvanzar, ocupado }) {
  const enGradeo = pedido.estado === ESTADOS_PEDIDO.EN_GRADEO;
  const pendientes = enGradeo ? pedido.unidades - resumenArticulos(pedido).resueltos : 0;
  if (enGradeo && pendientes > 0) {
    return <Boton href={rutaSubir(pedido.codigo)} variante="primario" className="boton-fila">Gradear ({pendientes})</Boton>;
  }
  return (
    <Boton variante={enGradeo ? 'primario' : 'oscuro'} className="boton-fila" disabled={ocupado} onClick={() => alAvanzar(pedido)}>
      {ocupado ? 'Guardando…' : ACCION_ESTADO[pedido.estado]}
    </Boton>
  );
}

/** Artículos declarados e historial de estados de un pedido. */
function DetallePedido({ pedido }) {
  return (
    <div className="detalle-cola">
      <div>
        <h3>Artículos</h3>
        <ol>
          {pedido.articulos.map((a, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>
              <strong>{a.nombre}</strong>
              <span className="pequeno">{[a.expansion, a.anio, a.numero].filter(Boolean).join(' · ')} · declarado {formatoPrecio(a.valorDeclarado)}</span>
              <span className={`pastilla pastilla--articulo-${a.estado}`}>{a.idCertificado ?? ETIQUETAS_ESTADO_ARTICULO[a.estado]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3>Historial</h3>
        <ol className="historial">
          {(pedido.historial ?? []).map((h) => (
            <li key={`${h.estado}-${h.fecha}`}>{ETIQUETAS_ESTADO_PEDIDO[h.estado]} <span className="pequeno">{formatoFecha(h.fecha)}</span></li>
          ))}
          {(pedido.historial ?? []).length === 0 && <li className="pequeno">Sin cambios registrados.</li>}
        </ol>
        {pedido.notas && <><h3>Notas del cliente</h3><p className="pequeno">{pedido.notas}</p></>}
      </div>
    </div>
  );
}

/** Cola de trabajo: el número de la izquierda es la posición (urgencia del plazo → prioridad → llegada). */
export function TablaCola({ pedidos, alAvanzar, ocupado }) {
  const [abierto, setAbierto] = useState(null);
  if (pedidos.length === 0) return <p className="apagado">No hay pedidos con este estado.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-cola tabla-adaptable">
        <caption className="solo-lectores">Cola de pedidos por plazo, prioridad y orden de llegada</caption>
        <thead>
          <tr>
            <th>#</th><th>Pedido</th><th>Cliente</th><th>Servicio</th><th>Llegada</th><th>Publicar antes de</th><th>Artículos</th><th>Estado</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, i) => (
            <Fragment key={p.codigo}>
              <tr className={abierto === p.codigo ? 'fila-abierta' : undefined}>
                <td className="celda-posicion"><strong>{i + 1}</strong></td>
                <td className="celda-titulo">
                  <button type="button" className="codigo-desplegable mono" aria-expanded={abierto === p.codigo}
                    onClick={() => setAbierto(abierto === p.codigo ? null : p.codigo)}>
                    {p.codigo}
                  </button>
                </td>
                <td data-etiqueta="Cliente"><div>{p.cliente?.nombre}<br /><span className="pequeno">{p.cliente?.email}</span></div></td>
                <td data-etiqueta="Servicio"><div>{p.servicio.nombre}<br /><Prioridad valor={p.servicio.prioridad} /></div></td>
                <td data-etiqueta="Llegada">{formatoFecha(p.fechaLlegada)}</td>
                <td data-etiqueta="Publicar antes de"><Plazo pedido={p} /></td>
                <td data-etiqueta="Artículos">{p.estado === ESTADOS_PEDIDO.EN_GRADEO ? `${resumenArticulos(p).resueltos} de ${p.unidades}` : p.unidades}</td>
                <td data-etiqueta="Estado"><Estado valor={p.estado} /></td>
                <td className="celda-acciones"><AccionesPedido pedido={p} alAvanzar={alAvanzar} ocupado={ocupado === p.codigo} /></td>
              </tr>
              {abierto === p.codigo && (
                <tr className="fila-detalle"><td colSpan={9}><DetallePedido pedido={p} /></td></tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
