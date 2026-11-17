import { rutaImagen } from '../ui/Foto.jsx';

/** Foto de ejemplo: slab de IGS con la etiqueta de muestra (10 PRISTINE). Fondo transparente. */
export const FOTO_EJEMPLO = '/ejemplos/slab-marshadow-machamp-gx.webp';

/** Slab de ejemplo de la portada. */
export function Losa({ foto = FOTO_EJEMPLO, decorativa = true }) {
  return (
    <div className="portada-visual" aria-hidden={decorativa || undefined}>
      <img className="losa-foto" src={rutaImagen(foto)} width="700" height="1177"
        alt="Slab de IGS: Marshadow & Machamp GX, Double Blaze 2019, grado 10 PRISTINE" />
    </div>
  );
}
