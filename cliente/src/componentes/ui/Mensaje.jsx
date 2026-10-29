/** Mensaje bajo un formulario: { tipo: 'ok' | 'error', texto }. */
export function Mensaje({ mensaje }) {
  return (
    <p className={`mensaje-formulario ${mensaje?.tipo ?? ''}`} role="status" aria-live="polite">
      {mensaje?.texto ?? ''}
    </p>
  );
}
