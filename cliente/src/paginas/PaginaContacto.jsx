import { api } from '../servicios/index.js';
import { useSesion } from '../hooks/useSesion.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { DatosContacto } from '../componentes/contacto/DatosContacto.jsx';
import { FormularioTicket } from '../componentes/contacto/FormularioTicket.jsx';

export function PaginaContacto() {
  useTituloPagina('Contacto');
  const { usuario } = useSesion();

  return (
    <div className="pagina">
      <div className="contenedor">
        <div className="pagina-cabecera">
          <h1>Contacto y ayuda</h1>
          <p>¿Dudas con un pedido o con una certificación? Abre un ticket y nuestro equipo te responderá por email.</p>
        </div>
        <div className="fila">
          <DatosContacto />
          <FormularioTicket key={usuario?.id ?? 'visitante'} usuario={usuario} alEnviar={api.tickets.crear} />
        </div>
      </div>
    </div>
  );
}
