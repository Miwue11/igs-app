import { ESTADOS_ARTICULO, ESTADOS_PEDIDO } from '@compartido';
import { api } from '../servicios/index.js';
import { useSesion } from '../hooks/useSesion.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { ListaPedidos } from '../componentes/cuenta/ListaPedidos.jsx';
import { FormularioPedido } from '../componentes/cuenta/FormularioPedido.jsx';
import { LeyendaPlazo } from '../componentes/ui/LeyendaPlazo.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';

const TERMINADOS = [ESTADOS_PEDIDO.COMPLETADO, ESTADOS_PEDIDO.ENVIADO];

/** Cifras rápidas de la cuenta. */
function ResumenCuenta({ pedidos }) {
  const enCurso = pedidos.filter((p) => !TERMINADOS.includes(p.estado)).length;
  const porEnviar = pedidos.filter((p) => p.estado === ESTADOS_PEDIDO.PENDIENTE_ENVIO).length;
  const certificados = pedidos.flatMap((p) => p.articulos ?? []).filter((a) => a.estado === ESTADOS_ARTICULO.GRADEADO).length;
  const cifras = [
    ['Pedidos en curso', enCurso],
    ['Esperando tu paquete', porEnviar],
    ['Certificados publicados', certificados],
  ];
  return (
    <dl className="resumen-cuenta">
      {cifras.map(([texto, valor]) => <div key={texto}><dt>{texto}</dt><dd>{valor}</dd></div>)}
    </dl>
  );
}

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
        <div className="cabecera-cuenta">
          <div className="pagina-cabecera">
            <span className="antetitulo-claro">Mi cuenta</span>
            <h1 className="titulo-cuenta">Hola, {usuario.nombre}</h1>
            <p>Sigue tus pedidos, consulta el resultado de cada artículo y haz un pedido nuevo.</p>
          </div>
          {pedidos.datos && <ResumenCuenta pedidos={pedidos.datos} />}
        </div>
        <div className="pila">
          <section className="pila" aria-labelledby="t-mis-pedidos">
            <div className="seccion-cabecera">
              <h2 className="seccion-titulo" id="t-mis-pedidos">Mis pedidos</h2>
              <LeyendaPlazo />
            </div>
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
