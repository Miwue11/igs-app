import { TIPOS_TICKET } from '@compartido';
import { useFormulario } from '../../hooks/useFormulario.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { CampoSelect } from '../ui/CampoSelect.jsx';
import { CampoArea } from '../ui/CampoArea.jsx';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const OPCIONES_TIPO = TIPOS_TICKET.map((t) => ({ valor: t.id, texto: t.nombre }));
const tipoValido = (tipo) => (OPCIONES_TIPO.some((o) => o.valor === tipo) ? tipo : OPCIONES_TIPO[0].valor);

/** Si el usuario ha entrado, su nombre y email ya vienen rellenos y sus pedidos aparecen como sugerencias. */
export function FormularioTicket({ usuario, alEnviar, tipoInicial, pedidos = [] }) {
  const inicial = { nombre: usuario?.nombre ?? '', email: usuario?.email ?? '', tipo: tipoValido(tipoInicial), referencia: '', mensaje: '' };
  const { valores, errores, mensaje, enviando, cambiar, enviar, reiniciar } = useFormulario({
    inicial,
    esquema: 'ticket',
    alEnviar: async (datos) => {
      const ticket = await alEnviar(datos);
      reiniciar(inicial);
      return `Ticket ${ticket.codigo} enviado. Te responderemos por email.`;
    },
  });

  return (
    <Tarjeta como="form" className="tarjeta-formulario columna" onSubmit={enviar} noValidate aria-labelledby="t-ticket">
      <h2 id="t-ticket">Abrir un ticket de ayuda</h2>
      <div className="rejilla-formulario">
        <CampoTexto id="c-nombre" name="nombre" etiqueta="Nombre" autoComplete="name" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoTexto id="c-email" name="email" type="email" etiqueta="Email" autoComplete="email" value={valores.email} onChange={cambiar} error={errores.email} />
        <CampoSelect id="c-tipo" name="tipo" etiqueta="Tipo de consulta" opciones={OPCIONES_TIPO} value={valores.tipo} onChange={cambiar} error={errores.tipo} />
        <CampoTexto id="c-ref" name="referencia" etiqueta="Nº de pedido o ID (opcional)" mono placeholder="PED-____ / IGS-____"
          list={pedidos.length > 0 ? 'c-ref-pedidos' : undefined} ayuda={pedidos.length > 0 ? 'Elige uno de tus pedidos o escribe un ID.' : undefined}
          value={valores.referencia} onChange={cambiar} />
        {pedidos.length > 0 && (
          <datalist id="c-ref-pedidos">
            {pedidos.map((p) => <option key={p.codigo} value={p.codigo}>{p.servicio.nombre}</option>)}
          </datalist>
        )}
      </div>
      <CampoArea id="c-mensaje" name="mensaje" etiqueta="Mensaje" rows={6} value={valores.mensaje} onChange={cambiar} error={errores.mensaje} />
      <Boton type="submit" grande className="alinear-inicio" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar ticket'}</Boton>
      <Mensaje mensaje={mensaje} />
    </Tarjeta>
  );
}
