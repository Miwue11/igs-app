/** Etiqueta pequeña dorada, como "Más solicitado". `esquina` la coloca sobre el borde superior de la tarjeta. */
export function Insignia({ esquina, children }) {
  return <span className={esquina ? 'insignia insignia-esquina' : 'insignia'}>{children}</span>;
}
