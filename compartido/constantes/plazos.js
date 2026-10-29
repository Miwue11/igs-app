/**
 * Plazos de gradeo. Se cuentan desde que el cliente crea el pedido hasta que
 * el gradeo se publica (pedido «Completado»).
 */
export const PLAZO_BASICO_DIAS = 14;

/** A partir de cuántos días antes de la fecha límite el pedido se considera urgente. */
export const DIAS_AVISO_PLAZO = 3;

/** Preferencia en la cola. Los servicios más caros tienen más prioridad. */
export const PRIORIDADES = Object.freeze({ NORMAL: 0, ALTA: 1, MAXIMA: 2 });

export const ETIQUETAS_PRIORIDAD = Object.freeze({
  [PRIORIDADES.NORMAL]: 'Normal',
  [PRIORIDADES.ALTA]: 'Alta',
  [PRIORIDADES.MAXIMA]: 'Máxima',
});

export const ESTADOS_PLAZO = Object.freeze({
  EN_PLAZO: 'en_plazo',
  PROXIMO: 'proximo',
  VENCIDO: 'vencido',
  CUMPLIDO: 'cumplido',
  CUMPLIDO_TARDE: 'cumplido_tarde',
});

export const ETIQUETAS_ESTADO_PLAZO = Object.freeze({
  [ESTADOS_PLAZO.EN_PLAZO]: 'En plazo',
  [ESTADOS_PLAZO.PROXIMO]: 'Vence pronto',
  [ESTADOS_PLAZO.VENCIDO]: 'Fuera de plazo',
  [ESTADOS_PLAZO.CUMPLIDO]: 'Publicado a tiempo',
  [ESTADOS_PLAZO.CUMPLIDO_TARDE]: 'Publicado con retraso',
});
