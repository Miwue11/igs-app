import { useState } from 'react';
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
import { Boton } from '../componentes/ui/Boton.jsx';

/** En la demo se entra con un clic con cualquiera de las cuentas de prueba. */
function CuentasDemo({ alEntrar }) {
  const [entrando, setEntrando] = useState(null);
  const entrarComo = async (u) => {
    setEntrando(u.email);
    try { await alEntrar({ email: u.email, contrasena: CONTRASENA_DEMO }); } finally { setEntrando(null); }
  };
  return (
    <div className="cuentas-demo">
      <p><strong>Modo demo:</strong> entra con una cuenta de prueba.</p>
      <div className="acciones">
        {DEMO_USUARIOS.slice(0, 3).map((u) => (
          <Boton key={u.email} variante="contorno" disabled={entrando !== null} onClick={() => entrarComo(u)}>
            {entrando === u.email ? 'Entrando…' : `Entrar como ${ETIQUETAS_ROL[u.rol].toLowerCase()}`}
          </Boton>
        ))}
      </div>
    </div>
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
      <div className="contenedor pagina-acceso">
        <div className="pagina-cabecera centrada">
          <h1>Accede a tu cuenta IGS</h1>
          <p>Inicia sesión para seguir tus pedidos o crea una cuenta para hacer el primero.</p>
        </div>
        {CONFIGURACION.MODO_DEMO && <CuentasDemo alEntrar={irDespuesDe(entrar)} />}
        <div className="fila">
          <FormularioInicioSesion alEntrar={irDespuesDe(entrar)} />
          <FormularioRegistro alRegistrar={irDespuesDe(registrarse)} />
        </div>
      </div>
    </div>
  );
}
