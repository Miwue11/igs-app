import { RUTAS } from '../../constantes/rutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { formatoFecha } from '../../utilidades/formato.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { FotosProducto } from './FotosProducto.jsx';
import { EtiquetaIGS } from './EtiquetaIGS.jsx';
import { InsigniaNota } from './InsigniaNota.jsx';
import { DatosProducto } from './DatosProducto.jsx';
import { Subnotas } from './Subnotas.jsx';
import { BotonCopiarEnlace } from './BotonCopiarEnlace.jsx';

/** Ficha pública completa de un producto gradeado. */
export function FichaProducto({ producto }) {
  return (
    <div className="producto">
      <div className="producto-visual">
        <EtiquetaIGS producto={producto} />
        <FotosProducto imagenes={producto.imagenes} imagenReferencia={producto.imagenReferencia} />
      </div>

      <section className="producto-datos" aria-label="Datos del producto">
        <div className="producto-titulo">
          <InsigniaNota nota={producto.nota} etiqueta={producto.etiquetaGrado} />
          <div>
            <span className="mono apagado">{producto.idCertificado}</span>
            <h1>{producto.nombre}</h1>
            <span className="apagado">Gradeado el {formatoFecha(producto.fechaGradeo)}</span>
          </div>
        </div>

        <DatosProducto producto={producto} />
        <Subnotas subnotas={producto.subnotas} />

        {producto.comentario && (
          <Tarjeta como="div" className="comentario">
            <h2>Comentario del gradeador</h2>
            <p>{producto.comentario}</p>
          </Tarjeta>
        )}

        <div className="acciones">
          <BotonCopiarEnlace />
          <Enlace href={RUTAS.CONTACTO}><strong>¿Algún dato no coincide? Avísanos</strong></Enlace>
        </div>
      </section>
    </div>
  );
}
