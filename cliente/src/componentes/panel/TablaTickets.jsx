import { Fragment, useState } from 'react';
import { ESTADOS_TICKET, ETIQUETAS_ESTADO_TICKET, TIPOS_TICKET } from '@compartido';
import { formatoFecha, plural } from '../../utilidades/formato.js';
import { Boton } from '../ui/Boton.jsx';

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

/** Mensaje completo, respuestas anteriores y formulario para responder. */
function HiloTicket({ ticket, alResponder }) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) { setError('Escribe la respuesta.'); return; }
    setEnviando(true);
    setError(null);
    try {
      await alResponder(ticket, texto);
      setTexto('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="hilo-ticket">
      <article className="mensaje-hilo mensaje-cliente">
        <header><strong>{ticket.nombre}</strong> <span className="pequeno">{formatoFecha(ticket.creadoEn)}</span></header>
        <p>{ticket.mensaje}</p>
      </article>
      {(ticket.respuestas ?? []).map((r) => (
        <article key={`${r.fecha}-${r.mensaje.slice(0, 12)}`} className="mensaje-hilo mensaje-igs">
          <header><strong>{r.autorNombre ?? 'Equipo IGS'}</strong> <span className="pequeno">{formatoFecha(r.fecha)}</span></header>
          <p>{r.mensaje}</p>
        </article>
      ))}
      <form className="responder-ticket" onSubmit={enviar} noValidate>
        <label htmlFor={`respuesta-${ticket.codigo}`}>Responder a {ticket.email}</label>
        <textarea id={`respuesta-${ticket.codigo}`} className="area-texto" rows={3} value={texto}
          onChange={(e) => setTexto(e.target.value)} aria-invalid={error ? true : undefined}
          aria-describedby={error ? `respuesta-${ticket.codigo}-error` : undefined} />
        {error && <p className="campo-error" id={`respuesta-${ticket.codigo}-error`}>{error}</p>}
        <Boton type="submit" disabled={enviando} className="alinear-inicio">{enviando ? 'Enviando…' : 'Enviar respuesta'}</Boton>
      </form>
    </div>
  );
}

export function TablaTickets({ tickets, alCambiarEstado, alResponder }) {
  const [abierto, setAbierto] = useState(null);
  if (tickets.length === 0) return <p className="apagado">No hay tickets con este estado.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-adaptable">
        <caption className="solo-lectores">Tickets de ayuda</caption>
        <thead>
          <tr><th>Ticket</th><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Mensaje</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <Fragment key={t.codigo}>
              <tr>
                <td className="mono celda-titulo">{t.codigo}</td>
                <td data-etiqueta="Fecha">{formatoFecha(t.creadoEn)}</td>
                <td data-etiqueta="Cliente"><div>{t.nombre}<br /><span className="pequeno">{t.email}</span></div></td>
                <td data-etiqueta="Tipo"><div>{nombreTipo(t.tipo)}{t.referencia && <><br /><span className="mono pequeno">{t.referencia}</span></>}</div></td>
                <td data-etiqueta="Mensaje" className="celda-texto">
                  <div>
                  <span className="mensaje-recortado">{t.mensaje}</span>
                  <button type="button" className="boton-enlace" aria-expanded={abierto === t.codigo}
                    onClick={() => setAbierto(abierto === t.codigo ? null : t.codigo)}>
                    {abierto === t.codigo ? 'Cerrar' : `Ver y responder${t.respuestas?.length ? ` (${plural(t.respuestas.length, 'respuesta')})` : ''}`}
                  </button>
                  </div>
                </td>
                <td data-etiqueta="Estado"><SelectorEstado ticket={t} alCambiar={alCambiarEstado} /></td>
              </tr>
              {abierto === t.codigo && (
                <tr className="fila-detalle"><td colSpan={6}><HiloTicket ticket={t} alResponder={alResponder} /></td></tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
