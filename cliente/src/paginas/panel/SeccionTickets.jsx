import { useState } from 'react';
import { ESTADOS_TICKET, ETIQUETAS_ESTADO_TICKET } from '@compartido';
import { api } from '../../servicios/index.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { TablaTickets } from '../../componentes/panel/TablaTickets.jsx';
import { Aviso } from '../../componentes/ui/Aviso.jsx';
import { Cargando } from '../../componentes/ui/Cargando.jsx';

const FILTROS = [{ valor: '', texto: 'Todos' }, ...Object.values(ESTADOS_TICKET).map((e) => ({ valor: e, texto: ETIQUETAS_ESTADO_TICKET[e] }))];

export function SeccionTickets() {
  useTituloPagina('Tickets de ayuda');
  const [filtro, setFiltro] = useState('');
  const [aviso, setAviso] = useState(null);
  const { datos: tickets, error, cargando, cambiarDatos } = useCarga(() => api.tickets.listar(filtro), [filtro]);

  const sustituir = (actualizado) =>
    cambiarDatos((lista) => lista
      .map((t) => (t.codigo === actualizado.codigo ? actualizado : t))
      .filter((t) => !filtro || t.estado === filtro || t.codigo === actualizado.codigo));

  const cambiarEstado = async (ticket, estado) => {
    try {
      sustituir(await api.tickets.cambiarEstado(ticket.codigo, estado));
      setAviso(null);
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    }
  };

  const responder = async (ticket, mensaje) => {
    sustituir(await api.tickets.responder(ticket.codigo, mensaje));
    setAviso({ tipo: 'ok', texto: `Respuesta añadida a ${ticket.codigo}.` });
  };

  return (
    <section aria-labelledby="t-tickets">
      <div className="seccion-cabecera">
        <h1 id="t-tickets">Tickets de ayuda</h1>
        <div className="filtros" role="group" aria-label="Filtrar por estado">
          {FILTROS.map((f) => (
            <button key={f.valor} type="button" className="filtro" aria-pressed={filtro === f.valor} onClick={() => setFiltro(f.valor)}>{f.texto}</button>
          ))}
        </div>
      </div>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      {cargando && !tickets && <Cargando />}
      {error && <Aviso tipo="error">{error.message}</Aviso>}
      {tickets && <TablaTickets tickets={tickets} alCambiarEstado={cambiarEstado} alResponder={responder} />}
    </section>
  );
}
