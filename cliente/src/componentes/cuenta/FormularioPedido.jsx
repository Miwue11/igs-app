import {
  ENVIO_VUELTA_EUR, errorArticulosServicio, importePedido, prepararArticulos,
} from '@compartido';
import { useFormulario } from '../../hooks/useFormulario.js';
import { formatoPlazo, formatoPrecio, formatoValorMax } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';
import { BuscadorCartas } from './BuscadorCartas.jsx';
import { ListaArticulos, ARTICULO_VACIO } from './ListaArticulos.jsx';

/** Servicios como tarjetas seleccionables (radios): se comparan de un vistazo sin abrir un desplegable. */
function SelectorServicio({ servicios, valor, alCambiar, error }) {
  return (
    <fieldset className="selector-servicio" aria-describedby={error ? 'p-servicio-error' : undefined}>
      <legend>1. Elige el servicio</legend>
      <div className="selector-servicio-opciones">
        {servicios.map((s) => (
          <label key={s.codigo} className="opcion-servicio">
            <input type="radio" name="servicio" value={s.codigo} checked={valor === s.codigo} onChange={alCambiar} />
            <span className="opcion-servicio-cuerpo">
              <strong>{s.nombre}</strong>
              <span className="opcion-servicio-precio">{formatoPrecio(s.precio)}<small> / artículo</small></span>
              <span className="pequeno">{formatoPlazo(s.plazoDias)} · {s.valorMax == null ? 'sin límite de valor' : `hasta ${formatoValorMax(s.valorMax)}`}</span>
            </span>
          </label>
        ))}
      </div>
      {error && <p className="campo-error" id="p-servicio-error">{error}</p>}
    </fieldset>
  );
}

/** Categorías de servicio en las que hay base de datos oficial de cartas. */
const CON_BUSCADOR = ['cartas'];

/** Lo que se envía a la API. La imagen oficial de la carta se guarda como referencia para el gradeador y la ficha. */
const preparar = (valores) => ({
  servicio: valores.servicio,
  notas: valores.notas,
  articulos: valores.articulos,
});

/** Resumen del envío: unidades, importe y avisos del servicio. */
function ResumenPedido({ servicio, articulos }) {
  const importe = importePedido(servicio, articulos);
  const aviso = articulos.length > 0 ? errorArticulosServicio(servicio, prepararArticulos(articulos)) : null;
  return (
    <div className="resumen-pedido" aria-live="polite">
      <dl>
        <div><dt>Artículos</dt><dd>{articulos.length}{servicio.minimoUnidades > 1 && ` (mínimo ${servicio.minimoUnidades})`}</dd></div>
        <div><dt>Valor declarado total</dt><dd>{formatoPrecio(importe.valorDeclarado)}</dd></div>
        <div><dt>Gradeo ({formatoPrecio(servicio.precio)} × {articulos.length})</dt><dd>{formatoPrecio(importe.gradeo)}</dd></div>
        <div><dt>Envío de vuelta asegurado</dt><dd>{formatoPrecio(ENVIO_VUELTA_EUR)}</dd></div>
        <div className="resumen-total"><dt>Total</dt><dd>{formatoPrecio(importe.total)}</dd></div>
      </dl>
      {aviso && <p className="campo-error">{aviso}</p>}
      <p className="pequeno">
        El plazo de {formatoPlazo(servicio.plazoDias)} empieza a contar cuando recibimos tu paquete.
        El valor declarado sirve para el seguro del envío y debe ser el valor de mercado de cada artículo.
      </p>
    </div>
  );
}

/** Formulario de pedido: el cliente elige el servicio y declara cada artículo que nos manda. */
export function FormularioPedido({ servicios, servicioInicial = '', alCrear }) {
  const inicial = { servicio: servicioInicial, articulos: [], notas: '' };
  const { valores, errores, mensaje, enviando, cambiar, asignar, enviar, reiniciar } = useFormulario({
    inicial,
    esquema: 'pedido',
    preparar,
    alEnviar: async (datos) => {
      const pedido = await alCrear(datos);
      reiniciar({ ...inicial, servicio: '' });
      return `Pedido ${pedido.codigo} creado. Envíanos los artículos con ese código dentro del paquete.`;
    },
  });

  const servicio = servicios.find((s) => s.codigo === valores.servicio);
  const anadir = (articulo) => asignar('articulos', [...valores.articulos, articulo]);

  return (
    <Tarjeta como="form" id="nuevo-pedido" className="tarjeta-formulario formulario-envio" onSubmit={enviar} noValidate aria-labelledby="t-pedido">
      <h2 id="t-pedido">Nuevo pedido</h2>
      <SelectorServicio servicios={servicios} valor={valores.servicio} alCambiar={cambiar} error={errores.servicio} />

      {servicio && (
        <>
          <fieldset className="grupo-envio">
            <legend>2. Artículos que nos envías</legend>
            {CON_BUSCADOR.includes(servicio.categoria) && <BuscadorCartas alAnadir={anadir} />}
            <div className="acciones">
              <Boton variante="contorno" onClick={() => anadir({ ...ARTICULO_VACIO })}>Añadir artículo a mano</Boton>
            </div>
            <ListaArticulos articulos={valores.articulos} alCambiar={(lista) => asignar('articulos', lista)} valorMax={servicio.valorMax} />
            {errores.articulos && <p className="campo-error" role="alert">{errores.articulos}</p>}
          </fieldset>

          <ResumenPedido servicio={servicio} articulos={valores.articulos} />

          <CampoArea id="p-notas" name="notas" etiqueta="Notas para el gradeador (opcional)" rows={3}
            value={valores.notas} onChange={cambiar} error={errores.notas} />
          <Boton type="submit" grande disabled={enviando}>{enviando ? 'Creando…' : 'Confirmar pedido'}</Boton>
        </>
      )}
      <Mensaje mensaje={mensaje} />
    </Tarjeta>
  );
}
