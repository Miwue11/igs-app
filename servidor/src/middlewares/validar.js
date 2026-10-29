import { validarCon, sinErrores } from '../../../compartido/index.js';
import { peticionIncorrecta } from '../utilidades/errorHttp.js';

/** Valida req.body con uno de los esquemas compartidos (los mismos que usa el formulario). */
export const validarCuerpo = (esquema) => (req, _res, next) => {
  const errores = validarCon(esquema, req.body);
  next(sinErrores(errores) ? undefined : peticionIncorrecta('Revisa los datos del formulario.', errores));
};

/** En los formularios con fotos los datos llegan como texto JSON en el campo "datos". */
export const leerDatosMultipart = (req, _res, next) => {
  if (typeof req.body?.datos !== 'string') return next();
  try {
    req.body = JSON.parse(req.body.datos);
    next();
  } catch {
    next(peticionIncorrecta('Los datos enviados no tienen un formato válido.'));
  }
};
