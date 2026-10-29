import { ProveedorSesion } from './contexto/ContextoSesion.jsx';
import { ProveedorRutas } from './enrutador/ProveedorRutas.jsx';
import { Rutas } from './enrutador/Rutas.jsx';
import { AvisoModoDemo } from './componentes/estructura/AvisoModoDemo.jsx';

/** Raíz de la aplicación: proveedores globales + enrutado. */
export function Aplicacion() {
  return (
    <ProveedorRutas>
      <ProveedorSesion>
        <AvisoModoDemo />
        <Rutas />
      </ProveedorSesion>
    </ProveedorRutas>
  );
}
