import { CONTRASENA_DEMO, DEMO_USUARIOS } from '@compartido/demo/datos.js';
import { ETIQUETAS_ROL } from '@compartido';
import { CONFIGURACION } from '../constantes/configuracion.js';
import { rutaInicioDe } from '../constantes/rutas.js';
import { useSesion } from '../hooks/useSesion.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { useRutas } from '../enrutador/useRutas.js';
import { Redirigir } from '../enrutador/Redirigir.jsx';
import { FormularioInicioSesion } from '../componentes/acceso/FormularioInicioSesion.jsx';
import { FormularioRegistro } from '../componentes/acceso/FormularioRegistro.jsx';
import { Aviso } from '../componentes/ui/Aviso.jsx';

function CuentasDemo() {
  return (
    <Aviso tipo="info" titulo="Modo demo">
      Prueba con {DEMO_USUARIOS.slice(0, 3).map((u) => `${u.email} (${ETIQUETAS_ROL[u.rol]})`).join(', ')} · contraseña {CONTRASENA_DEMO}
    </Aviso>
  );
}

/** Solo se aceptan rutas internas en ?volver= (evita redirecciones a otras webs). */
const volverSeguro = (valor) => (valor?.startsWith('/') && !valor.startsWith('//') ? valor : null);

export function PaginaAcceder() {
  useTituloPagina('Acceder');
  const { usuario, entrar, registrarse } = useSesion();
  const { query, navegar } = useRutas();
  const volver = volverSeguro(query.get('volver'));

  if (usuario) return <Redirigir a={volver ?? rutaInicioDe(usuario.rol)} />;

  const irDespuesDe = (accion) => async (datos) => {
    const nuevo = await accion(datos);
    navegar(volver ?? rutaInicioDe(nuevo.rol), { reemplazar: true });
  };

  return (
    <div className="pagina">
      <div className="contenedor pagina-estrecha">
        <div className="pagina-cabecera"><h1>Accede a tu cuenta IGS</h1></div>
        {CONFIGURACION.MODO_DEMO && <CuentasDemo />}
        <div className="fila">
          <FormularioInicioSesion alEntrar={irDespuesDe(entrar)} />
          <FormularioRegistro alRegistrar={irDespuesDe(registrarse)} />
        </div>
      </div>
    </div>
  );
}
