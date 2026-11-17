import { DEMO_PRODUCTOS } from '@compartido/demo/datos.js';
import { EtiquetaIGS } from '../producto/EtiquetaIGS.jsx';
import { rutaImagen } from '../ui/Foto.jsx';

/** Foto de ejemplo: la carta de la etiqueta de muestra de IGS. */
export const FOTO_EJEMPLO = '/ejemplos/marshadow-machamp-gx.jpg';

/** Slab de IGS: la etiqueta arriba y el producto encapsulado debajo. Sin producto muestra el ejemplo de la demo. */
export function Losa({ producto = DEMO_PRODUCTOS[0], foto = FOTO_EJEMPLO, decorativa = true }) {
  return (
    <div className="portada-visual" aria-hidden={decorativa || undefined}>
      <div className="losa">
        <EtiquetaIGS producto={producto} />
        <div className="losa-hueco">
          {foto ? <img src={rutaImagen(foto)} alt={`Anverso de ${producto.nombre}`} /> : <span>[Imagen del producto]</span>}
        </div>
      </div>
    </div>
  );
}
