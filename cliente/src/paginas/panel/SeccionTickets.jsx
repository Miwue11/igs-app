import { useState } from 'react';
import { api } from '../../servicios/index.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { TablaTickets } from '../../componentes/panel/TablaTickets.jsx';
import { Aviso } from '../../componentes/ui/Aviso.jsx';
import { Cargando } from '../../componentes/ui/Cargando.jsx';

export function SeccionTickets() {
  useTituloPagina('Tickets de ayuda');
  const [aviso, setAviso] = useState(null);
  const { datos: tickets, error, cargando, cambiarDatos } = useCarga(() => api.tickets.listar());

  const cambiarEstado = async (ticket, estado) => {
    try {
      const actualizado = await api.tickets.cambiarEstado(ticket.codigo, estado);
      cambiarDatos((lista) => lista.map((t) => (t.codigo === actualizado.codigo ? actualizado : t)));
      setAviso(null);
    } catch (e) {
      setAviso(e.message);
    }
  };

  return (
    <section aria-labelledby="t-tickets">
      <h1 id="t-tickets">Tickets de ayuda</h1>
      {aviso && <Aviso tipo="error">{aviso}</Aviso>}
      {cargando && <Cargando />}
      {error && <Aviso tipo="error">{error.message}</Aviso>}
      {tickets && <TablaTickets tickets={tickets} alCambiarEstado={cambiarEstado} />}
    </section>
  );
}
