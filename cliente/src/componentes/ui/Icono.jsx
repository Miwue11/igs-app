/** Iconos de trazo en SVG (decorativos: el texto de al lado da el significado). */
const TRAZOS = {
  escudo: ['M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  alerta: ['M12 3l10 18H2z', 'M12 10v5', 'M12 18h.01'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 11v6', 'M12 7h.01'],
  subir: ['M12 16V4', 'M7 9l5-5 5 5', 'M4 16v4h16v-4'],
  chispa: ['M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z'],
};

export function Icono({ nombre, tamano = 22 }) {
  return (
    <svg aria-hidden="true" width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {(TRAZOS[nombre] ?? []).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
