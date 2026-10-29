import { RUTAS } from '../constantes/rutas.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { Boton } from '../componentes/ui/Boton.jsx';

export function PaginaNoEncontrada() {
  useTituloPagina('Página no encontrada');
  return (
    <div className="pagina">
      <div className="contenedor pagina-cabecera">
        <h1>Esta página no existe</h1>
        <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <Boton href={RUTAS.INICIO} variante="oscuro" className="alinear-inicio">Volver al inicio</Boton>
      </div>
    </div>
  );
}
