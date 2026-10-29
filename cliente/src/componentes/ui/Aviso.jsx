import { Icono } from './Icono.jsx';

/** Franja de aviso a todo el ancho (verde = correcto, rojo = error, gris = información). */
export function Aviso({ tipo = 'info', titulo, children }) {
  const icono = { ok: 'escudo', error: 'alerta', info: 'info' }[tipo];
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icono nombre={icono} />
      {titulo && <strong>{titulo}</strong>}
      <span>{children}</span>
    </div>
  );
}
