/**
 * Plazos de gradeo. Como en PSA y BGS, se cuentan desde que el paquete llega a IGS
 * (pedido «Recibido») hasta que el gradeo se publica (pedido «Completado»).
 */
export const PLAZO_ESTANDAR_DIAS = 14;

/** A partir de cuántos días antes de la fecha límite el pedido se considera urgente. */
export const DIAS_AVISO_PLAZO = 3;

/** Preferencia en la cola. Los servicios más caros tienen más prioridad. */
export const PRIORIDADES = Object.freeze({ NORMAL: 0, ALTA: 1, MAXIMA: 2 });

export const ETIQUETAS_PRIORIDAD = Object.freeze({
  [PRIORIDADES.NORMAL]: 'Estándar',
  [PRIORIDADES.ALTA]: 'Preferente',
  [PRIORIDADES.MAXIMA]: 'Máxima',
});

export const ESTADOS_PLAZO = Object.freeze({
  SIN_INICIAR: 'sin_iniciar',
  EN_PLAZO: 'en_plazo',
  PROXIMO: 'proximo',
  VENCIDO: 'vencido',
  CUMPLIDO: 'cumplido',
  CUMPLIDO_TARDE: 'cumplido_tarde',
});

export const ETIQUETAS_ESTADO_PLAZO = Object.freeze({
  [ESTADOS_PLAZO.SIN_INICIAR]: 'Empieza al recibir el paquete',
  [ESTADOS_PLAZO.EN_PLAZO]: 'En plazo',
  [ESTADOS_PLAZO.PROXIMO]: 'Vence pronto',
  [ESTADOS_PLAZO.VENCIDO]: 'Fuera de plazo',
  [ESTADOS_PLAZO.CUMPLIDO]: 'Publicado a tiempo',
  [ESTADOS_PLAZO.CUMPLIDO_TARDE]: 'Publicado con retraso',
});
