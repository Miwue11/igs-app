import { useState } from 'react';
import { Campo, atributosError } from './Campo.jsx';

/** Campo de contraseña con botón para mostrarla u ocultarla. */
export function CampoContrasena({ id, etiqueta, error, ayuda, className, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <Campo id={id} etiqueta={etiqueta} error={error} ayuda={ayuda} className={className}>
      <div className="entrada-con-boton">
        <input id={id} type={visible ? 'text' : 'password'} className="entrada" {...atributosError(id, error)} {...props} />
        <button type="button" className="boton-mostrar" onClick={() => setVisible((v) => !v)}
          aria-pressed={visible} aria-controls={id}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </Campo>
  );
}
