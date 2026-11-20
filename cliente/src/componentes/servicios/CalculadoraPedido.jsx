import { useState } from 'react';
import { ENVIO_VUELTA_EUR, importePedido } from '@compartido';
import { formatoFecha, formatoPrecio, plural } from '../../utilidades/formato.js';
import { Boton } from '../ui/Boton.jsx';

/** Días orientativos que tarda un paquete nacional en llegar a IGS (solo para la estimación). */
const DIAS_TRANSITO = 3;
const MAX_ARTICULOS = 1000;

const sumarDias = (dias) => new Date(Date.now() + dias * 86_400_000).toISOString();

/** Calcula el total de un pedido y la fecha aproximada de publicación si se envía hoy. */
export function CalculadoraPedido({ servicios, alElegir }) {
  const conPrecio = servicios.filter((s) => s.precio != null);
  const [codigo, setCodigo] = useState(conPrecio[0]?.codigo ?? '');
  const [cantidad, setCantidad] = useState(5);
  const servicio = conPrecio.find((s) => s.codigo === codigo);
  if (!servicio) return null;

  const unidades = Math.min(Math.max(Number(cantidad) || 0, 0), MAX_ARTICULOS);
  const importe = importePedido(servicio, Array.from({ length: unidades }, () => ({ valorDeclarado: 0 })));
  const bajoMinimo = unidades < (servicio.minimoUnidades ?? 1);

  return (
    <section className="calculadora tarjeta" aria-labelledby="t-calculadora">
      <div className="calculadora-texto">
        <h2 id="t-calculadora">Calcula tu pedido</h2>
        <p className="apagado">Elige el servicio y cuántos artículos vas a enviar. El precio es por artículo y el envío de vuelta asegurado se paga una vez por pedido.</p>
      </div>
      <div className="calculadora-campos">
        <div className="campo">
          <label htmlFor="calc-servicio">Servicio</label>
          <select id="calc-servicio" className="selector" value={codigo} onChange={(e) => setCodigo(e.target.value)}>
            {conPrecio.map((s) => <option key={s.codigo} value={s.codigo}>{s.nombre} · {formatoPrecio(s.precio)}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="calc-cantidad">Artículos</label>
          <input id="calc-cantidad" className="entrada" type="number" inputMode="numeric" min="1" max={MAX_ARTICULOS}
            value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </div>
      </div>
      <dl className="calculadora-resultado" aria-live="polite">
        <div><dt>Gradeo ({plural(unidades, 'artículo')})</dt><dd>{formatoPrecio(importe.gradeo)}</dd></div>
        <div><dt>Envío de vuelta asegurado</dt><dd>{formatoPrecio(ENVIO_VUELTA_EUR)}</dd></div>
        <div className="calculadora-total"><dt>Total</dt><dd>{formatoPrecio(importe.total)}</dd></div>
        <div><dt>Publicado como muy tarde, si lo envías hoy</dt><dd>{formatoFecha(sumarDias(DIAS_TRANSITO + servicio.plazoDias))}*</dd></div>
      </dl>
      <p className="pequeno">* Estimación con {DIAS_TRANSITO} días de envío hasta IGS. El plazo garantizado empieza cuando recibimos el paquete.</p>
      {bajoMinimo
        ? <p className="campo-error">Este servicio necesita al menos {servicio.minimoUnidades} artículos.</p>
        : <Boton variante="primario" onClick={() => alElegir(servicio)}>Hacer este pedido</Boton>}
    </section>
  );
}
