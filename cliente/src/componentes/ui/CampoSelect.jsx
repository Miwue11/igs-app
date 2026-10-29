import { Campo, atributosError } from './Campo.jsx';

/** opciones: [{ valor, texto }] */
export function CampoSelect({ id, etiqueta, error, opciones, vacio, className, ...props }) {
  return (
    <Campo id={id} etiqueta={etiqueta} error={error} className={className}>
      <select id={id} className="selector" {...atributosError(id, error)} {...props}>
        {vacio && <option value="">{vacio}</option>}
        {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
    </Campo>
  );
}
