import { clases } from '../../utilidades/clases.js';

/** Etiqueta + control + mensaje de error. Lo usan todos los campos de formulario. */
export function Campo({ id, etiqueta, error, ayuda, className, children }) {
  return (
    <div className={clases('campo', className)}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {ayuda && !error && <p className="campo-ayuda" id={`${id}-ayuda`}>{ayuda}</p>}
      {error && <p className="campo-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

/** Atributos de accesibilidad que enlazan el control con su error. */
export const atributosError = (id, error) =>
  error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {};
