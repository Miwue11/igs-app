import { useFormulario } from '../../hooks/useFormulario.js';
import { calcularFechaLimite } from '@compartido';
import { formatoFecha, formatoPlazo, formatoPrecio } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoSelect } from '../ui/CampoSelect.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const opcion = (s) => ({ valor: s.codigo, texto: `${s.nombre} · ${formatoPlazo(s.plazoDias)} · ${formatoPrecio(s.precio)}` });

/** Aviso con la fecha máxima de publicación si el pedido se crea ahora. */
function AvisoPlazo({ servicio }) {
  if (!servicio) return null;
  return (
    <p className="aclaracion" aria-live="polite">
      Tu gradeo se publicará como máximo el <strong>{formatoFecha(calcularFechaLimite(new Date(), servicio.plazoDias))}</strong> ({formatoPlazo(servicio.plazoDias)} desde hoy).
    </p>
  );
}

/** Alta de un pedido de gradeo por parte del cliente. */
export function FormularioPedido({ servicios, servicioInicial = '', alCrear }) {
  const inicial = { servicio: servicioInicial, unidades: '1', notas: '' };
  const { valores, errores, mensaje, enviando, cambiar, enviar, reiniciar } = useFormulario({
    inicial,
    esquema: 'pedido',
    alEnviar: async (datos) => {
      const pedido = await alCrear(datos);
      reiniciar({ ...inicial, servicio: '' });
      return `Pedido ${pedido.codigo} creado. Envíanos los productos indicando ese código en el paquete.`;
    },
  });

  return (
    <Tarjeta como="form" className="tarjeta-formulario" onSubmit={enviar} noValidate aria-labelledby="t-pedido">
      <h2 id="t-pedido">Nuevo pedido</h2>
      <CampoSelect id="p-servicio" name="servicio" etiqueta="Servicio" vacio="Elige un servicio"
        opciones={servicios.map(opcion)} value={valores.servicio} onChange={cambiar} error={errores.servicio} />
      <AvisoPlazo servicio={servicios.find((s) => s.codigo === valores.servicio)} />
      <CampoTexto id="p-unidades" name="unidades" type="number" min="1" max="1000" etiqueta="Número de productos"
        value={valores.unidades} onChange={cambiar} error={errores.unidades} />
      <CampoArea id="p-notas" name="notas" etiqueta="Notas para el gradeador (opcional)" rows={3}
        value={valores.notas} onChange={cambiar} error={errores.notas} />
      <Boton type="submit" grande disabled={enviando}>{enviando ? 'Creando…' : 'Crear pedido'}</Boton>
      <Mensaje mensaje={mensaje} />
    </Tarjeta>
  );
}
