import { ROLES } from '@compartido';
import { api } from '../servicios/index.js';
import { useSesion } from '../hooks/useSesion.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { DatosContacto } from '../componentes/contacto/DatosContacto.jsx';
import { FormularioTicket } from '../componentes/contacto/FormularioTicket.jsx';
import { PreguntasFrecuentes } from '../componentes/comun/PreguntasFrecuentes.jsx';

export function PaginaContacto() {
  useTituloPagina('Contacto');
  const { usuario } = useSesion();
  const { query } = useRutas();
  const esCliente = usuario?.rol === ROLES.CLIENTE;
  const { datos: pedidos } = useCarga(() => (esCliente ? api.pedidos.mios() : Promise.resolve([])), [esCliente]);

  return (
    <div className="pagina">
      <div className="contenedor">
        <div className="pagina-cabecera">
          <h1>Contacto y ayuda</h1>
          <p>Antes de escribirnos, mira si tu duda está en las preguntas frecuentes. Si no, abre un ticket y te responderemos por email.</p>
        </div>
        <PreguntasFrecuentes />
        <div className="fila fila-arriba">
          <FormularioTicket key={usuario?.id ?? 'visitante'} usuario={usuario} alEnviar={api.tickets.crear}
            tipoInicial={query.get('tipo')} pedidos={pedidos ?? []} />
          <DatosContacto />
        </div>
      </div>
    </div>
  );
}
