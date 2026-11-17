import { useState } from 'react';
import {
  ETIQUETAS_ESTADO_PEDIDO, ETIQUETAS_ESTADO_PLAZO, ETIQUETAS_PRIORIDAD, estadoPlazo, siguienteEstado, resumenArticulos,
} from '@compartido';
import { api } from '../../servicios/index.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { aCsv, descargarArchivo } from '../../utilidades/csv.js';
import { formatoFecha } from '../../utilidades/formato.js';
import { BarraCola } from '../../componentes/panel/BarraCola.jsx';
import { TablaCola } from '../../componentes/panel/TablaCola.jsx';
import { Aviso } from '../../componentes/ui/Aviso.jsx';
import { Cargando } from '../../componentes/ui/Cargando.jsx';

const COLUMNAS_CSV = [
  { titulo: 'Posición', valor: (p) => p.posicion },
  { titulo: 'Pedido', valor: (p) => p.codigo },
  { titulo: 'Cliente', valor: (p) => p.cliente?.nombre },
  { titulo: 'Llegada', valor: (p) => formatoFecha(p.fechaLlegada) },
  { titulo: 'Unidades', valor: (p) => p.unidades },
  { titulo: 'Resueltos', valor: (p) => resumenArticulos(p).resueltos },
  { titulo: 'Total (€)', valor: (p) => p.importe?.total ?? '' },
  { titulo: 'Servicio', valor: (p) => p.servicio.nombre },
  { titulo: 'Prioridad', valor: (p) => ETIQUETAS_PRIORIDAD[p.servicio.prioridad ?? 0] },
  { titulo: 'Publicar antes de', valor: (p) => formatoFecha(p.fechaLimite) },
  { titulo: 'Plazo', valor: (p) => ETIQUETAS_ESTADO_PLAZO[estadoPlazo(p)] },
  { titulo: 'Estado', valor: (p) => ETIQUETAS_ESTADO_PEDIDO[p.estado] },
];

const nombreCsv = () => `cola-pedidos-igs-${new Date().toISOString().slice(0, 10)}.csv`;

export function SeccionCola() {
  useTituloPagina('Cola de pedidos');
  const [filtro, setFiltro] = useState('');
  const [ocupado, setOcupado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const { datos: pedidos, error, cargando, recargar } = useCarga(() => api.pedidos.cola(filtro), [filtro]);

  const avanzar = async (pedido) => {
    setOcupado(pedido.codigo);
    try {
      const nuevo = siguienteEstado(pedido.estado);
      await api.pedidos.cambiarEstado(pedido.codigo, nuevo);
      setAviso({ tipo: 'ok', texto: `${pedido.codigo} → ${ETIQUETAS_ESTADO_PEDIDO[nuevo]}` });
      await recargar();
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    } finally {
      setOcupado(null);
    }
  };

  const exportar = () =>
    descargarArchivo(nombreCsv(), aCsv(COLUMNAS_CSV, (pedidos ?? []).map((p, i) => ({ ...p, posicion: i + 1 }))));

  return (
    <section aria-labelledby="t-cola">
      <div className="seccion-cabecera">
        <div>
          <h1 id="t-cola">Cola de pedidos</h1>
          <p className="apagado">Orden: primero los que vencen en 3 días o menos, después por prioridad del servicio y por orden de llegada. El plazo empieza al recibir el paquete (14 días en el gradeo básico) y el pedido solo se publica cuando todos sus artículos están gradeados o marcados como no gradeables.</p>
        </div>
        <BarraCola filtro={filtro} alFiltrar={setFiltro} alExportar={exportar} />
      </div>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      {cargando && !pedidos && <Cargando />}
      {error && <Aviso tipo="error">{error.message}</Aviso>}
      {pedidos && <TablaCola pedidos={pedidos} alAvanzar={avanzar} ocupado={ocupado} />}
    </section>
  );
}
