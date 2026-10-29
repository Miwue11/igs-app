import { useFormulario } from '../../hooks/useFormulario.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { Boton } from '../ui/Boton.jsx';
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
      <CampoTexto id="l-pass" name="contrasena" type="password" etiqueta="Contraseña"
        autoComplete="current-password" value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />
      <Boton type="submit" grande disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</Boton>
      <Mensaje mensaje={mensaje} />
      <p className="pequeno">Clientes, trabajadores y administradores entran por aquí. Cada perfil verá su propio panel.</p>
    </Tarjeta>
  );
}
