import {
  ENVIO_VUELTA_EUR, errorArticulosServicio, importePedido, prepararArticulos,
} from '@compartido';
import { useFormulario } from '../../hooks/useFormulario.js';
import { formatoPlazo, formatoPrecio, formatoValorMax } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoSelect } from '../ui/CampoSelect.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';
import { BuscadorCartas } from './BuscadorCartas.jsx';
import { ListaArticulos, ARTICULO_VACIO } from './ListaArticulos.jsx';

const opcion = (s) => ({
  valor: s.codigo,
  texto: `${s.nombre} · ${formatoPrecio(s.precio)}/art. · hasta ${formatoValorMax(s.valorMax)} · ${formatoPlazo(s.plazoDias)}`,
});

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
    <Tarjeta como="form" className="tarjeta-formulario formulario-envio" onSubmit={enviar} noValidate aria-labelledby="t-pedido">
      <h2 id="t-pedido">Nuevo pedido</h2>
      <CampoSelect id="p-servicio" name="servicio" etiqueta="1. Servicio" vacio="Elige un servicio"
        opciones={servicios.map(opcion)} value={valores.servicio} onChange={cambiar} error={errores.servicio} />

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
