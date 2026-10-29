import { ETIQUETAS_ROL } from '@compartido';
import { SECCIONES_PANEL } from '../../constantes/navegacion.js';
import { RUTAS } from '../../constantes/rutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { useSesion } from '../../hooks/useSesion.js';
import { Logo } from '../ui/Logo.jsx';

/** Menú del panel interno. Solo muestra las secciones que permite el rol del usuario. */
export function BarraLateral({ seccionActiva }) {
  const { usuario, salir } = useSesion();
  const secciones = SECCIONES_PANEL.filter((s) => s.roles.includes(usuario.rol));

  return (
    <aside className="barra-lateral">
      <Logo titulo="Panel interno" subtitulo={`Rol: ${ETIQUETAS_ROL[usuario.rol]}`} pequeno />
      <nav className="menu-lateral" aria-label="Panel">
        {secciones.map((s) => {
          const activa = s.id === seccionActiva;
          return (
            <Enlace key={s.id} href={`${RUTAS.PANEL}?seccion=${s.id}`} className={activa ? 'activo' : undefined} aria-current={activa ? 'page' : undefined}>
              {s.texto}
              {s.soloAdmin && <span className="etiqueta-admin">admin</span>}
            </Enlace>
          );
        })}
      </nav>
      <div className="barra-lateral-pie">
        <Enlace href={RUTAS.INICIO}>Ver la web pública</Enlace>
        <button type="button" className="boton-enlace" onClick={salir}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
