import { useRef, useState } from 'react';
import { Foto, rutaImagen } from '../ui/Foto.jsx';

/** Miniatura que se amplía a pantalla completa en un <dialog> (Esc o el botón la cierran). */
function FotoAmpliable({ src, texto, className }) {
  const dialogo = useRef(null);
  const [abierta, setAbierta] = useState(false);
  if (!src) return <Foto src={src} texto={texto} className={className} />;

  const abrir = () => { setAbierta(true); dialogo.current?.showModal(); };
  const cerrar = () => dialogo.current?.close();

  return (
    <>
      <button type="button" className="foto-boton" onClick={abrir} aria-label={`Ampliar: ${texto}`}>
        <Foto src={src} texto={texto} className={className} />
        <span className="foto-lupa" aria-hidden="true">Ampliar</span>
      </button>
      <dialog ref={dialogo} className="visor-foto" onClose={() => setAbierta(false)}
        onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }} aria-label={texto}>
        {abierta && <img src={rutaImagen(src)} alt={texto} />}
        <button type="button" className="visor-cerrar" onClick={cerrar} aria-label="Cerrar">×</button>
      </dialog>
    </>
  );
}

/** Fotos de IGS tras el encapsulado. Si aún no hay, se muestra la imagen oficial de la carta como referencia. */
export function FotosProducto({ imagenes = {}, imagenReferencia = null }) {
  const sinFotos = !imagenes.anverso && !imagenes.reverso;
  if (sinFotos && imagenReferencia) {
    return (
      <section className="fotos" aria-label="Imágenes">
        <div className="fotos-rejilla">
          <FotoAmpliable src={imagenReferencia} texto="Imagen oficial de la carta" className="foto-referencia" />
        </div>
        <p>Imagen oficial de la carta como referencia. Las fotos de IGS se añaden tras el encapsulado.</p>
      </section>
    );
  }
  return (
    <section className="fotos" aria-label="Imágenes">
      <div className="fotos-rejilla">
        <FotoAmpliable src={imagenes.anverso} texto="Foto del anverso" />
        <FotoAmpliable src={imagenes.reverso} texto="Foto del reverso" />
      </div>
      <p>Fotos tomadas por IGS tras el encapsulado. Pulsa una foto para ampliarla.</p>
    </section>
  );
}
