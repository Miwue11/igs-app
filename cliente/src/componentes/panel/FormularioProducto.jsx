import {
  SUBNOTAS, ESTADOS_ARTICULO, calcularNotaFinal, etiquetaGrado, nivelGrado,
} from '@compartido';
import { formatoNota, formatoPrecio } from '../../utilidades/formato.js';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { CampoSelect } from '../ui/CampoSelect.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';
import {
  OPCIONES_SUBNOTA, OPCIONES_CATEGORIA, OPCIONES_IDIOMA, CAMPO_SUBNOTA, subnotasDe, valoresDesdeArticulo,
} from './opcionesProducto.js';

const pendientes = (pedido) =>
  (pedido?.articulos ?? []).map((a, i) => ({ ...a, indice: i })).filter((a) => a.estado === ESTADOS_ARTICULO.PENDIENTE);

/** Nota final calculada con las subnotas, con el color de su distintivo (rojo PRISTINE, dorado GEM MINT, plata). */
function NotaCalculada({ subnotas }) {
  const nota = calcularNotaFinal(subnotas);
  if (nota == null) {
    return <p className="nota-calculada" aria-live="polite">Pon las cuatro subnotas y la nota final se calcula sola.</p>;
  }
  const grado = etiquetaGrado(nota, subnotas);
  return (
    <p className={`nota-calculada etiqueta-${nivelGrado(nota, grado)}`} aria-live="polite">
      <strong>{formatoNota(nota)}</strong>
      <span>Nota final · <b>{grado}</b><br /><small>Media de las subnotas; nunca más de 1 punto sobre la más baja.</small></span>
    </p>
  );
}

/** Ficha del producto gradeado: sale de un artículo declarado por el cliente. El estado lo gestiona useFormulario. */
export function FormularioProducto({ formulario, pedidos, extra }) {
  const { valores, errores, mensaje, enviando, cambiar, rellenar, enviar } = formulario;
  const campo = (name) => ({ name, value: valores[name], onChange: cambiar, error: errores[name] });

  const pedido = pedidos.find((p) => p.codigo === valores.pedido);
  const opcionesPedido = pedidos.map((p) => ({
    valor: p.codigo,
    texto: `${p.codigo} · ${p.cliente?.nombre ?? ''} · ${pendientes(p).length} pendientes`,
  }));
  const opcionesArticulo = pendientes(pedido).map((a) => ({
    valor: String(a.indice),
    texto: `${a.indice + 1}. ${a.nombre}${a.expansion ? ` · ${a.expansion}` : ''} · ${formatoPrecio(a.valorDeclarado)}`,
  }));

  const elegirPedido = (e) => rellenar({ pedido: e.target.value, articulo: '' });
  const elegirArticulo = (e) => {
    const indice = e.target.value;
    rellenar({ articulo: indice, ...(indice === '' ? {} : valoresDesdeArticulo(pedido.articulos[Number(indice)])) });
  };

  return (
    <form className="rejilla-formulario formulario-producto" onSubmit={enviar} noValidate aria-label="Datos del producto gradeado">
      <CampoSelect id="p-pedido" etiqueta="Pedido" vacio="Elige un pedido en gradeo" opciones={opcionesPedido}
        {...campo('pedido')} onChange={elegirPedido} />
      <CampoSelect id="p-articulo" etiqueta="Artículo declarado" vacio={pedido ? 'Elige el artículo' : 'Primero elige el pedido'}
        opciones={opcionesArticulo} disabled={!pedido} {...campo('articulo')} onChange={elegirArticulo} />
      {pedido && valores.articulo !== '' && pedido.articulos[Number(valores.articulo)]?.imagen && (
        <figure className="completo referencia-articulo">
          <img src={pedido.articulos[Number(valores.articulo)].imagen} alt="" width="90" height="125" />
          <figcaption>Imagen oficial de la carta que declaró el cliente. Compruébala con la carta física.</figcaption>
        </figure>
      )}
      <CampoTexto id="p-nombre" etiqueta="Nombre del producto" {...campo('nombre')} />
      <CampoTexto id="p-marca" etiqueta="Marca / juego" {...campo('marca')} />
      <CampoTexto id="p-anio" etiqueta="Año" inputMode="numeric" {...campo('anio')} />
      <CampoTexto id="p-expansion" etiqueta="Expansión / colección" {...campo('expansion')} />
      <CampoTexto id="p-clase" etiqueta="Clase / rareza" {...campo('clase')} />
      <CampoTexto id="p-num" etiqueta="Nº de tarjeta" {...campo('numeroTarjeta')} />
      <CampoSelect id="p-cat" etiqueta="Categoría" opciones={OPCIONES_CATEGORIA} {...campo('categoria')} />
      <CampoTexto id="p-var" etiqueta="Variedad" {...campo('variedad')} />
      <CampoSelect id="p-idioma" etiqueta="Idioma" opciones={OPCIONES_IDIOMA} {...campo('idioma')} />

      <fieldset className="completo grupo-subnotas">
        <legend>Subnotas</legend>
        {SUBNOTAS.map((s) => (
          <CampoSelect key={s.id} id={`p-${s.id}`} etiqueta={s.nombre} vacio="—" opciones={OPCIONES_SUBNOTA} {...campo(CAMPO_SUBNOTA(s.id))} />
        ))}
      </fieldset>
      <div className="completo"><NotaCalculada subnotas={subnotasDe(valores)} /></div>

      <CampoArea id="p-comentario" etiqueta="Comentario sobre la nota" rows={3} className="completo" {...campo('comentario')} />

      <div className="acciones completo">
        <Boton type="submit" grande disabled={enviando}>{enviando ? 'Guardando…' : 'Publicar certificado'}</Boton>
        {extra}
      </div>
      <div className="completo"><Mensaje mensaje={mensaje} /></div>
    </form>
  );
}
