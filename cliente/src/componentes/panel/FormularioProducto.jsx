import { SUBNOTAS } from '@compartido';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { CampoSelect } from '../ui/CampoSelect.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';
import {
  OPCIONES_NOTA, OPCIONES_SUBNOTA, OPCIONES_CATEGORIA, OPCIONES_IDIOMA, CAMPO_SUBNOTA,
} from './opcionesProducto.js';

/** Campos de la ficha del producto gradeado. El estado lo gestiona quien lo usa (useFormulario). */
export function FormularioProducto({ formulario, pedidos, extra }) {
  const { valores, errores, mensaje, enviando, cambiar, enviar } = formulario;
  const campo = (name) => ({ name, value: valores[name], onChange: cambiar, error: errores[name] });
  const opcionesPedido = pedidos.map((p) => ({ valor: p.codigo, texto: `${p.codigo} · ${p.cliente?.nombre ?? ''}` }));

  return (
    <form className="rejilla-formulario formulario-producto" onSubmit={enviar} noValidate aria-label="Datos del producto gradeado">
      <CampoSelect id="p-pedido" etiqueta="Pedido" vacio="Elige un pedido en gradeo" opciones={opcionesPedido} {...campo('pedido')} />
      <CampoTexto id="p-nombre" etiqueta="Nombre del producto" {...campo('nombre')} />
      <CampoSelect id="p-nota" etiqueta="Grado (nota final)" vacio="Elige la nota" opciones={OPCIONES_NOTA} {...campo('nota')} />
      <CampoTexto id="p-marca" etiqueta="Marca / juego" {...campo('marca')} />
      <CampoTexto id="p-anio" etiqueta="Año" inputMode="numeric" {...campo('anio')} />
      <CampoTexto id="p-expansion" etiqueta="Expansión / colección" {...campo('expansion')} />
      <CampoTexto id="p-clase" etiqueta="Clase" {...campo('clase')} />
      <CampoTexto id="p-num" etiqueta="Nº de tarjeta" {...campo('numeroTarjeta')} />
      <CampoSelect id="p-cat" etiqueta="Categoría" opciones={OPCIONES_CATEGORIA} {...campo('categoria')} />
      <CampoTexto id="p-var" etiqueta="Variedad" {...campo('variedad')} />
      <CampoSelect id="p-idioma" etiqueta="Idioma" opciones={OPCIONES_IDIOMA} {...campo('idioma')} />

      <fieldset className="completo grupo-subnotas">
        <legend>Subnotas (opcionales)</legend>
        {SUBNOTAS.map((s) => (
          <CampoSelect key={s.id} id={`p-${s.id}`} etiqueta={s.nombre} vacio="—" opciones={OPCIONES_SUBNOTA} {...campo(CAMPO_SUBNOTA(s.id))} />
        ))}
      </fieldset>

      <CampoArea id="p-comentario" etiqueta="Comentario sobre la nota" rows={3} className="completo" {...campo('comentario')} />

      <div className="acciones completo">
        <Boton type="submit" grande disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar en la base de datos'}</Boton>
        {extra}
      </div>
      <div className="completo"><Mensaje mensaje={mensaje} /></div>
    </form>
  );
}
