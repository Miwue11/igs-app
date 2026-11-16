import { Enlace } from '../../enrutador/Enlace.jsx';
import { RUTAS } from '../../constantes/rutas.js';

/** Logo + nombre. `subtitulo` sustituye a "Iberian Grading Services" (p. ej. en el panel). */
export function Logo({ titulo = 'IGS', subtitulo = 'Iberian Grading Services', pequeno }) {
  const tam = pequeno ? { width: 40, height: 48 } : { width: 44, height: 52 };
  return (
    <Enlace href={RUTAS.INICIO} className="marca">
      <img src={`${import.meta.env.BASE_URL}logo-igs.svg`} alt="" {...tam} />
      <span className="marca-texto"><strong>{titulo}</strong><span>{subtitulo}</span></span>
    </Enlace>
  );
}
