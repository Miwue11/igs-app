import { useFormulario } from '../../hooks/useFormulario.js';
import { Tarjeta } from '../ui/Tarjeta.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { Casilla } from '../ui/Casilla.jsx';
import { Boton } from '../ui/Boton.jsx';
import { CampoContrasena } from '../ui/CampoContrasena.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const INICIAL = { nombre: '', email: '', contrasena: '', contrasena2: '', condiciones: false };

export function FormularioRegistro({ alRegistrar }) {
  const { valores, errores, mensaje, enviando, cambiar, enviar } = useFormulario({
    inicial: INICIAL, esquema: 'registro', alEnviar: alRegistrar,
  });

  return (
    <Tarjeta como="form" className="tarjeta-formulario" onSubmit={enviar} noValidate aria-labelledby="t-registro">
      <h2 id="t-registro">Crear cuenta</h2>
      <CampoTexto id="r-nombre" name="nombre" etiqueta="Nombre y apellidos" autoComplete="name"
        value={valores.nombre} onChange={cambiar} error={errores.nombre} />
      <CampoTexto id="r-email" name="email" type="email" etiqueta="Email" autoComplete="email"
        value={valores.email} onChange={cambiar} error={errores.email} />
      <div className="rejilla-formulario">
        <CampoContrasena id="r-pass" name="contrasena" etiqueta="Contraseña" autoComplete="new-password"
          ayuda="Mínimo 8 caracteres." value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />
        <CampoContrasena id="r-pass2" name="contrasena2" etiqueta="Repetir contraseña" autoComplete="new-password"
          value={valores.contrasena2} onChange={cambiar} error={errores.contrasena2} />
      </div>
      <Casilla id="r-condiciones" name="condiciones" checked={valores.condiciones} onChange={cambiar} error={errores.condiciones}>
        Acepto las condiciones de uso y la política de privacidad
      </Casilla>
      <Boton type="submit" grande disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Registrarme'}</Boton>
      <Mensaje mensaje={mensaje} />
    </Tarjeta>
  );
}
