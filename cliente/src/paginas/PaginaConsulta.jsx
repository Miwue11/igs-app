import { api } from '../servicios/index.js';
import { useCarga } from '../hooks/useCarga.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { rutaConsulta } from '../constantes/rutas.js';
import { BuscadorCertificado } from '../componentes/producto/BuscadorCertificado.jsx';
import { FichaProducto } from '../componentes/producto/FichaProducto.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';
import { Cargando } from '../componentes/ui/Cargando.jsx';

function Resultado({ id, producto, error, cargando }) {
  if (!id) return <Aviso tipo="info">Escribe el ID que aparece en la etiqueta del producto (formato IGS-AAAA-NNNNNN).</Aviso>;
  if (cargando) return <Cargando texto="Buscando el certificado…" />;
  if (error) return <Aviso tipo="error" titulo="Certificado no encontrado">{error.message}</Aviso>;
  return (
    <>
      <Aviso tipo="ok" titulo="Certificado verificado">Este ID existe en la base de datos de IGS y coincide con la etiqueta del producto.</Aviso>
      <FichaProducto producto={producto} />
    </>
  );
}

/** Consulta pública de un producto gradeado: /consulta?id=IGS-2026-000001 */
export function PaginaConsulta() {
  const { query, navegar } = useRutas();
  const id = query.get('id') ?? '';
  useTituloPagina(id ? `Certificado ${id}` : 'Consultar ID');

  const { datos, error, cargando } = useCarga(() => (id ? api.productos.consultar(id) : Promise.resolve(null)), [id]);

  return (
    <div className="pagina">
      <div className="contenedor">
        <BuscadorCertificado key={id} inicial={id} alBuscar={(nuevo) => navegar(rutaConsulta(nuevo))} />
        <Resultado id={id} producto={datos} error={error} cargando={cargando} />
      </div>
    </div>
  );
}
