import { ESTADOS_EN_COLA, ETIQUETAS_ESTADO_PEDIDO } from '@compartido';
import { Boton } from '../ui/Boton.jsx';

const OPCIONES = [{ valor: '', texto: 'Todos los estados' }, ...ESTADOS_EN_COLA.map((e) => ({ valor: e, texto: ETIQUETAS_ESTADO_PEDIDO[e] }))];

export function BarraCola({ filtro, alFiltrar, alExportar }) {
  return (
    <div className="barra-herramientas">
      <label htmlFor="f-estado" className="solo-lectores">Filtrar por estado</label>
      <select id="f-estado" className="selector" value={filtro} onChange={(e) => alFiltrar(e.target.value)}>
        {OPCIONES.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
      <Boton variante="contorno" onClick={alExportar}>Exportar copia</Boton>
    </div>
  );
}
