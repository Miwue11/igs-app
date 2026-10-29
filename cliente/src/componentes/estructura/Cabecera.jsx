import { esInterno } from '@compartido';
import { MENU_PRINCIPAL } from '../../constantes/navegacion.js';
import { RUTAS } from '../../constantes/rutas.js';
import { useRutas } from '../../enrutador/useRutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { Logo } from '../ui/Logo.jsx';
import { Boton } from '../ui/Boton.jsx';

function MenuPrincipal() {
  const { ruta } = useRutas();
  return (
    <nav className="menu" aria-label="Principal">
      {MENU_PRINCIPAL.map((item) => {
        const activo = item.ruta === ruta;
        return (
          <Enlace key={item.ruta} href={item.ruta} className={activo ? 'activo' : undefined} aria-current={activo ? 'page' : undefined}>
            {item.texto}
          </Enlace>
        );
      })}
    </nav>
  );
}

function AccionesSesion() {
  const { usuario, salir } = useSesion();
  if (!usuario) return <Boton href={RUTAS.ACCEDER}>Acceder</Boton>;

  const destino = esInterno(usuario.rol) ? { href: RUTAS.PANEL, texto: 'Panel' } : { href: RUTAS.MI_CUENTA, texto: 'Mi cuenta' };
  return (
    <div className="sesion">
      <Boton href={destino.href} variante="dorado">{destino.texto}</Boton>
      <button type="button" className="boton-enlace" onClick={salir}>Salir</button>
    </div>
  );
}

export function Cabecera() {
  return (
    <header className="cabecera">
      <div className="contenedor">
        <Logo />
        <MenuPrincipal />
        <AccionesSesion />
      </div>
    </header>
  );
}
