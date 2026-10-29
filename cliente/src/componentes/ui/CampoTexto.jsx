import { Campo, atributosError } from './Campo.jsx';
import { clases } from '../../utilidades/clases.js';

export function CampoTexto({ id, etiqueta, error, ayuda, mono, className, type = 'text', ...props }) {
  return (
    <Campo id={id} etiqueta={etiqueta} error={error} ayuda={ayuda} className={className}>
      <input id={id} type={type} className={clases('entrada', mono && 'mono')} {...atributosError(id, error)} {...props} />
    </Campo>
  );
}
