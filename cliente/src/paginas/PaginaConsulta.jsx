import { api } from '../servicios/index.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { Enlace } from '../enrutador/Enlace.jsx';
import { rutaConsulta } from '../constantes/rutas.js';
import { BuscadorCertificado } from '../componentes/producto/BuscadorCertificado.jsx';
import { FichaProducto } from '../componentes/producto/FichaProducto.jsx';
import { EtiquetaIGS } from '../componentes/producto/EtiquetaIGS.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';

const ID_EJEMPLO = 'IGS-2026-000001';
const ETIQUETA_EJEMPLO = {
  nombre: 'Marshadow & Machamp GX', anio: 2019, expansion: 'Double Blaze', idCertificado: ID_EJEMPLO,
  nota: 10, subnotas: { centrado: 10, esquinas: 10, bordes: 10, superficie: 10 },
};

/** Sin ID: explica dónde está el ID y cómo comprobar el slab. */
function GuiaConsulta() {
  return (
    <div className="guia-consulta">
      <figure>
        <div className="guia-etiqueta">
          <EtiquetaIGS producto={ETIQUETA_EJEMPLO} />
          <span className="guia-marca" aria-hidden="true" />
        </div>
        <figcaption>El ID está en la parte inferior de la etiqueta delantera y junto al código de barras de la trasera.</figcaption>
      </figure>
      <ol className="guia-pasos">
        <li><span><strong>Busca el ID o escanea el QR</strong>Con la cámara del móvil, el QR de la trasera abre directamente la ficha.</span></li>
        <li><span><strong>Compara la ficha con el slab</strong>Las fotos, el grado y los datos tienen que coincidir con lo que tienes delante.</span></li>
        <li><span><strong>Comprueba el código UV</strong>Con una lámpara UV aparece un código en la trasera: escríbelo en la ficha.</span></li>
        <li><span><strong>¿Quieres ver un ejemplo?</strong><Enlace href={rutaConsulta(ID_EJEMPLO)} className="mono">Abrir {ID_EJEMPLO}</Enlace></span></li>
      </ol>
    </div>
  );
}

function Resultado({ id, producto, error, cargando }) {
  if (!id) return <GuiaConsulta />;
  if (cargando) return <Cargando texto="Buscando el certificado…" />;
  if (error) return <Aviso tipo="error" titulo="Certificado no encontrado">{error.message} Revisa que el ID tenga el formato IGS-AAAA-NNNNNN.</Aviso>;
  return (
    <>
      <Aviso tipo="ok" titulo="Certificado verificado">Este ID existe en la base de datos de IGS. Comprueba que las fotos y los datos coinciden con el slab.</Aviso>
      <FichaProducto producto={producto} />
    </>
  );
}

/** Consulta pública de un producto gradeado: /consulta?id=IGS-2026-000001 */
export function PaginaConsulta() {
  const { query, navegar } = useRutas();
  const id = query.get('id') ?? '';
  useTituloPagina(id ? `Certificado ${id}` : 'Verificar un certificado');

  const { datos, error, cargando } = useCarga(() => (id ? api.productos.consultar(id) : Promise.resolve(null)), [id]);

  return (
    <div className="pagina">
      <div className="contenedor">
        {!id && (
          <div className="pagina-cabecera">
            <h1>Verificar un certificado</h1>
            <p>Antes de comprar un producto gradeado por IGS, comprueba que su ID existe y que la ficha coincide con el slab. La consulta es pública y no necesita cuenta.</p>
          </div>
        )}
        <BuscadorCertificado key={id} inicial={id} alBuscar={(nuevo) => navegar(rutaConsulta(nuevo))} />
        <Resultado id={id} producto={datos} error={error} cargando={cargando} />
      </div>
    </div>
  );
}
