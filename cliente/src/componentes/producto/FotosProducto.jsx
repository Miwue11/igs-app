import { Foto } from '../ui/Foto.jsx';

/** Fotos de IGS tras el encapsulado. Si aún no hay, se muestra la imagen oficial de la carta como referencia. */
export function FotosProducto({ imagenes = {}, imagenReferencia = null }) {
  const sinFotos = !imagenes.anverso && !imagenes.reverso;
  if (sinFotos && imagenReferencia) {
    return (
      <section className="fotos" aria-label="Imágenes">
        <div className="fotos-rejilla">
          <Foto src={imagenReferencia} texto="Imagen oficial de la carta" className="foto-referencia" />
        </div>
        <p>Imagen oficial de la carta como referencia. Las fotos de IGS se añaden tras el encapsulado.</p>
      </section>
    );
  }
  return (
    <section className="fotos" aria-label="Imágenes">
      <div className="fotos-rejilla">
        <Foto src={imagenes.anverso} texto="Foto anverso" />
        <Foto src={imagenes.reverso} texto="Foto reverso" />
      </div>
      <p>Fotos tomadas por IGS tras el encapsulado.</p>
    </section>
  );
}
