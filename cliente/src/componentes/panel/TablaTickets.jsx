import { ESTADOS_TICKET, ETIQUETAS_ESTADO_TICKET, TIPOS_TICKET } from '@compartido';
import { formatoFecha } from '../../utilidades/formato.js';

const nombreTipo = (id) => TIPOS_TICKET.find((t) => t.id === id)?.nombre ?? id;

function SelectorEstado({ ticket, alCambiar }) {
  return (
    <>
      <label htmlFor={`estado-${ticket.codigo}`} className="solo-lectores">Estado del ticket {ticket.codigo}</label>
      <select id={`estado-${ticket.codigo}`} className="selector selector-pequeno" value={ticket.estado}
        onChange={(e) => alCambiar(ticket, e.target.value)}>
        {Object.values(ESTADOS_TICKET).map((e) => <option key={e} value={e}>{ETIQUETAS_ESTADO_TICKET[e]}</option>)}
      </select>
    </>
  );
}

export function TablaTickets({ tickets, alCambiarEstado }) {
  if (tickets.length === 0) return <p className="apagado">No hay tickets.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="solo-lectores">Tickets de ayuda</caption>
        <thead>
          <tr><th>Ticket</th><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Mensaje</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.codigo}>
              <td className="mono">{t.codigo}</td>
              <td>{formatoFecha(t.creadoEn)}</td>
              <td>{t.nombre}<br /><span className="pequeno">{t.email}</span></td>
              <td>{nombreTipo(t.tipo)}{t.referencia && <><br /><span className="mono pequeno">{t.referencia}</span></>}</td>
              <td className="celda-texto">{t.mensaje}</td>
              <td><SelectorEstado ticket={t} alCambiar={alCambiarEstado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
