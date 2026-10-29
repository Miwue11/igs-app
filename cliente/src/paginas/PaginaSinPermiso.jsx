import { rutaInicioDe } from '../constantes/rutas.js';
import { useSesion } from '../hooks/useSesion.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { Boton } from '../componentes/ui/Boton.jsx';

export function PaginaSinPermiso() {
  useTituloPagina('Acceso restringido');
  const { usuario } = useSesion();
  return (
    <div className="pagina">
      <div className="contenedor pagina-cabecera">
        <h1>Acceso restringido</h1>
        <p>Tu perfil no tiene permiso para ver esta página.</p>
        <Boton href={rutaInicioDe(usuario?.rol)} variante="oscuro" className="alinear-inicio">Ir a mi zona</Boton>
      </div>
    </div>
  );
}
