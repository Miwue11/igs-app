import { Foto } from '../ui/Foto.jsx';

export function FotosProducto({ imagenes = {} }) {
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
