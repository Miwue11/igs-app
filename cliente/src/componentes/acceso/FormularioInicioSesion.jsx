import { useFormulario } from '../../hooks/useFormulario.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { Boton } from '../ui/Boton.jsx';
import { CampoContrasena } from '../ui/CampoContrasena.jsx';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { RUTAS } from '../../constantes/rutas.js';
import { Mensaje } from '../ui/Mensaje.jsx';

const INICIAL = { email: '', contrasena: '' };

export function FormularioInicioSesion({ alEntrar }) {
  const { valores, errores, mensaje, enviando, cambiar, enviar } = useFormulario({
    inicial: INICIAL, esquema: 'entrar', alEnviar: alEntrar,
  });

  return (
    <Tarjeta como="form" className="tarjeta-formulario" onSubmit={enviar} noValidate aria-labelledby="t-entrar">
      <h2 id="t-entrar">Iniciar sesión</h2>
      <CampoTexto id="l-email" name="email" type="email" etiqueta="Email" placeholder="tu@email.com"
        autoComplete="email" value={valores.email} onChange={cambiar} error={errores.email} />
      <CampoContrasena id="l-pass" name="contrasena" etiqueta="Contraseña"
        autoComplete="current-password" value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />
      <Enlace href={`${RUTAS.CONTACTO}?tipo=cuenta`} className="enlace-pequeno">¿Has olvidado la contraseña?</Enlace>
      <Boton type="submit" grande disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</Boton>
      <Mensaje mensaje={mensaje} />
      <p className="pequeno">Clientes, trabajadores y administradores entran por aquí. Cada perfil verá su propio panel.</p>
    </Tarjeta>
  );
}
