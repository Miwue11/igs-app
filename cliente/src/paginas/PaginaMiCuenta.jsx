import { api } from '../servicios/index.js';
import { useSesion } from '../hooks/useSesion.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { ListaPedidos } from '../componentes/cuenta/ListaPedidos.jsx';
import { FormularioPedido } from '../componentes/cuenta/FormularioPedido.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';

/** Área del cliente: sus pedidos y el alta de pedidos nuevos. */
export function PaginaMiCuenta() {
  useTituloPagina('Mi cuenta');
  const { usuario } = useSesion();
  const { query } = useRutas();
  const pedidos = useCarga(api.pedidos.mios);
  const servicios = useCarga(api.servicios.listar);

  const crear = async (datos) => {
    const nuevo = await api.pedidos.crear(datos);
    pedidos.cambiarDatos((lista) => [nuevo, ...(lista ?? [])]);
    return nuevo;
  };

  return (
    <div className="pagina">
      <div className="contenedor">
        <div className="pagina-cabecera">
          <h1>Hola, {usuario.nombre}</h1>
          <p>Aquí puedes ver el estado de tus pedidos, el resultado de cada artículo y preparar un envío nuevo.</p>
        </div>
        <div className="pila">
          <section className="pila" aria-labelledby="t-mis-pedidos">
            <h2 className="seccion-titulo" id="t-mis-pedidos">Mis pedidos</h2>
            {pedidos.cargando && <Cargando />}
            {pedidos.error && <Aviso tipo="error">{pedidos.error.message}</Aviso>}
            {pedidos.datos && <ListaPedidos pedidos={pedidos.datos} />}
          </section>
          {servicios.datos && (
            <FormularioPedido servicios={servicios.datos} servicioInicial={query.get('servicio') ?? ''} alCrear={crear} />
          )}
        </div>
      </div>
    </div>
  );
}
