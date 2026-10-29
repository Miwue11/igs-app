import { Cabecera } from './Cabecera.jsx';
import { Pie } from './Pie.jsx';

/** Estructura de las páginas públicas: cabecera, contenido y pie. */
export function PlantillaPublica({ children }) {
  return (
    <>
      <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
      <Cabecera />
      <main id="contenido">{children}</main>
      <Pie />
    </>
  );
}
