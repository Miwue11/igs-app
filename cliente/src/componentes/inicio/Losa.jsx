import { rutaImagen } from '../ui/Foto.jsx';

/** Fotos de ejemplo: slab de IGS por delante (10 PRISTINE) y por detrás (QR de verificación). Fondo transparente. */
export const FOTOS_EJEMPLO = Object.freeze({
  frontal: '/ejemplos/slab-frontal.webp',
  trasera: '/ejemplos/slab-trasera.webp',
});

/** Slab de ejemplo de la portada: frontal y trasera, una al lado de la otra. */
export function Losa({ fotos = FOTOS_EJEMPLO, decorativa = true }) {
  return (
    <div className="portada-visual losa-par" aria-hidden={decorativa || undefined}>
      <img className="losa-foto" src={rutaImagen(fotos.frontal)} width="699" height="1177"
        alt="Slab de IGS por delante: Marshadow & Machamp GX, Double Blaze 2019, grado 10 PRISTINE" />
      <img className="losa-foto losa-foto-trasera" src={rutaImagen(fotos.trasera)} width="699" height="1172"
        alt="Slab de IGS por detrás, con el código QR que abre la ficha del certificado" />
    </div>
  );
}
