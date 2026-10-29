import { atributosError } from './Campo.jsx';

/** Checkbox con su texto al lado. */
export function Casilla({ id, children, error, ...props }) {
  return (
    <div>
      <label className="casilla" htmlFor={id}>
        <input id={id} type="checkbox" {...atributosError(id, error)} {...props} /> {children}
      </label>
      {error && <p className="campo-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
