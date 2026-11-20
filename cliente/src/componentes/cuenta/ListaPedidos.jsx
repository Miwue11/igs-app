import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ESTADOS_ARTICULO, ESTADOS_PEDIDO, ETIQUETAS_ESTADO_ARTICULO, resumenArticulos } from '@compartido';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { rutaConsulta } from '../../constantes/rutas.js';
import { DATOS_CONTACTO } from '../../constantes/contenido.js';
import { formatoFecha, formatoPrecio, plural } from '../../utilidades/formato.js';
import { Estado } from '../ui/Estado.jsx';
import { Plazo } from '../ui/Plazo.jsx';
import { Boton } from '../ui/Boton.jsx';
import { SeguimientoPedido } from './SeguimientoPedido.jsx';

/** Pedidos antiguos sin importe guardado: se calcula con el precio del servicio. */
const total = (p) => p.importe?.total ?? (p.servicio.precio == null ? null : p.servicio.precio * p.unidades);
const DIRECCION_ENVIOS = DATOS_CONTACTO[0].valor;

function ResultadoArticulo({ articulo }) {
  if (articulo.estado === ESTADOS_ARTICULO.GRADEADO) {
    return <Enlace href={rutaConsulta(articulo.idCertificado)} className="mono">{articulo.idCertificado}</Enlace>;
  }
  if (articulo.estado === ESTADOS_ARTICULO.NO_GRADEABLE) {
    return <span>{ETIQUETAS_ESTADO_ARTICULO[articulo.estado]}: {articulo.motivo}</span>;
  }
  return <span className="apagado">{ETIQUETAS_ESTADO_ARTICULO[articulo.estado]}</span>;
}

const descripcion = (a) => [a.expansion, a.anio, a.numero].filter(Boolean).join(' · ');

/** Detalle desplegable con lo que declaró el cliente y el resultado de cada artículo. */
function DetalleArticulos({ pedido }) {
  const { total: cuantos, resueltos } = resumenArticulos(pedido);
  return (
    <details className="detalle-articulos">
      <summary>Ver {plural(cuantos, 'artículo')} ({resueltos} {resueltos === 1 ? 'resuelto' : 'resueltos'})</summary>
      <ol>
        {pedido.articulos.map((a, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>
            <span>
              <strong>{a.nombre}</strong>
              {descripcion(a) && ` · ${descripcion(a)}`}
              {' · '}declarado {formatoPrecio(a.valorDeclarado)}
            </span>
            <ResultadoArticulo articulo={a} />
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Desglose del importe guardado en el pedido. */
function Desglose({ pedido }) {
  const { importe } = pedido;
  if (!importe) return null;
  return (
    <dl className="desglose">
      <div><dt>Gradeo ({formatoPrecio(pedido.servicio.precio)} × {pedido.unidades})</dt><dd>{formatoPrecio(importe.gradeo)}</dd></div>
      <div><dt>Envío de vuelta asegurado</dt><dd>{formatoPrecio(importe.envio)}</dd></div>
      <div><dt>Valor declarado (seguro)</dt><dd>{formatoPrecio(importe.valorDeclarado)}</dd></div>
    </dl>
  );
}

/** Hoja para meter en la caja: se pinta fuera de la página y solo aparece al imprimir. */
function HojaEnvio({ pedido }) {
  return createPortal(
    <div className="hoja-envio">
      <h1>Hoja de envío · IGS</h1>
      <p className="hoja-envio-codigo">{pedido.codigo}</p>
      <p><strong>Servicio:</strong> {pedido.servicio.nombre} · {plural(pedido.unidades, 'artículo')}</p>
      <p><strong>Enviar a:</strong><br />{DIRECCION_ENVIOS.split('\n').map((l) => <span key={l}>{l}<br /></span>)}</p>
      <table>
        <thead><tr><th>#</th><th>Artículo</th><th>Valor declarado</th></tr></thead>
        <tbody>
          {pedido.articulos.map((a, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={i}><td>{i + 1}</td><td>{a.nombre}{descripcion(a) && ` · ${descripcion(a)}`}</td><td>{formatoPrecio(a.valorDeclarado)}</td></tr>
          ))}
        </tbody>
      </table>
      <p>Mete esta hoja dentro de la caja. Envía el paquete asegurado por {formatoPrecio(pedido.importe?.valorDeclarado)}.</p>
    </div>,
    document.body,
  );
}

/** Qué hacer con un pedido que todavía no ha llegado. */
function InstruccionesEnvio({ pedido, alImprimir }) {
  return (
    <div className="instrucciones-envio">
      <p>
        <strong>Siguiente paso: envíanos el paquete.</strong> Cada carta en su funda y en una funda semirrígida, todas en una caja
        con relleno, y esta hoja dentro. El plazo de {pedido.servicio.plazoDias} días empieza cuando lo recibimos.
      </p>
      <Boton variante="contorno" onClick={() => alImprimir(pedido)}>Imprimir hoja de envío</Boton>
    </div>
  );
}

/** Pedidos del cliente con su seguimiento, importe y el resultado de cada artículo. */
export function ListaPedidos({ pedidos }) {
  const [hoja, setHoja] = useState(null);

  useEffect(() => {
    if (!hoja) return undefined;
    document.body.classList.add('imprimiendo-hoja');
    const listo = window.setTimeout(() => window.print(), 50);
    const acabar = () => { document.body.classList.remove('imprimiendo-hoja'); setHoja(null); };
    window.addEventListener('afterprint', acabar);
    return () => { window.clearTimeout(listo); window.removeEventListener('afterprint', acabar); };
  }, [hoja]);

  if (pedidos.length === 0) return <p className="apagado">Todavía no has hecho ningún pedido.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-adaptable tabla-pedidos">
        <caption className="solo-lectores">Mis pedidos</caption>
        <thead>
          <tr><th>Pedido</th><th>Servicio</th><th>Artículos</th><th>Total</th><th>Fecha</th><th>Publicación como máximo</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <Fragment key={p.codigo}>
              <tr className="fila-pedido">
                <td className="mono celda-titulo">{p.codigo}</td>
                <td data-etiqueta="Servicio">{p.servicio.nombre}</td>
                <td data-etiqueta="Artículos">{p.unidades}</td>
                <td data-etiqueta="Total">
                  <details className="total-desplegable">
                    <summary>{formatoPrecio(total(p))}</summary>
                    <Desglose pedido={p} />
                  </details>
                </td>
                <td data-etiqueta="Fecha">{formatoFecha(p.creadoEn)}</td>
                <td data-etiqueta="Publicación"><Plazo pedido={p} /></td>
                <td data-etiqueta="Estado"><Estado valor={p.estado} /></td>
              </tr>
              <tr className="fila-detalle">
                <td colSpan={7}>
                  <SeguimientoPedido pedido={p} />
                  {p.estado === ESTADOS_PEDIDO.PENDIENTE_ENVIO && <InstruccionesEnvio pedido={p} alImprimir={setHoja} />}
                  {p.articulos?.length > 0 && <DetalleArticulos pedido={p} />}
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
      {hoja && <HojaEnvio pedido={hoja} />}
    </div>
  );
}
