import { Campo, atributosError } from './Campo.jsx';

export function CampoArea({ id, etiqueta, error, className, rows = 5, ...props }) {
  return (
    <Campo id={id} etiqueta={etiqueta} error={error} className={className}>
      <textarea id={id} rows={rows} className="area-texto" {...atributosError(id, error)} {...props} />
    </Campo>
  );
}
