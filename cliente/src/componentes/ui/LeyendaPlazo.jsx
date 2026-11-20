/** Explica los colores de las pastillas de plazo. */
const COLORES = [
  ['sin_iniciar', 'Aún no ha llegado'],
  ['en_plazo', 'En plazo'],
  ['proximo', 'Vence en 3 días o menos'],
  ['vencido', 'Fuera de plazo'],
];

export function LeyendaPlazo() {
  return (
    <ul className="leyenda-plazo" aria-label="Colores del plazo">
      {COLORES.map(([clave, texto]) => (
        <li key={clave}><span className={`pastilla-punto pastilla--${clave}`} aria-hidden="true" />{texto}</li>
      ))}
    </ul>
  );
}
