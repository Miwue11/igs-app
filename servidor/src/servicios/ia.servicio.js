import { ENTORNO } from '../configuracion/entorno.js';
import { HTTP } from '../constantes/http.js';
import { ErrorHttp, peticionIncorrecta } from '../utilidades/errorHttp.js';
import { elegir } from '../utilidades/elegir.js';

const URL_API = 'https://api.anthropic.com/v1/messages';
const VERSION_API = '2023-06-01';
const CAMPOS = ['nombre', 'nota', 'marca', 'anio', 'expansion', 'clase', 'numeroTarjeta', 'categoria', 'variedad', 'idioma'];

const INSTRUCCIONES = `Lee la etiqueta de gradeo de la imagen. Responde SOLO con un objeto JSON con estas claves:
nombre, nota (número de 1 a 10), marca, anio (año de 4 cifras), expansion, clase, numeroTarjeta, categoria ("tcg", "deportivas" o "comics"), variedad, idioma.
Usa null en lo que no se lea con claridad. No inventes datos.`;

const peticion = (imagenBase64, tipo) => ({
  model: ENTORNO.MODELO_IA,
  max_tokens: 400,
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: tipo, data: imagenBase64 } },
      { type: 'text', text: INSTRUCCIONES },
    ],
  }],
});

const extraerJSON = (texto = '') => {
  const inicio = texto.indexOf('{');
  const fin = texto.lastIndexOf('}');
  if (inicio < 0 || fin < inicio) return {};
  try {
    return JSON.parse(texto.slice(inicio, fin + 1));
  } catch {
    return {};
  }
};

/** Envía la foto de la etiqueta al modelo y devuelve los campos que ha podido leer. */
export const leerEtiqueta = async (archivo) => {
  if (!ENTORNO.ANTHROPIC_API_KEY) throw new ErrorHttp(HTTP.NO_DISPONIBLE, 'La lectura con IA no está configurada en el servidor.');
  if (!archivo) throw peticionIncorrecta('Sube primero la foto de la etiqueta.');

  const imagen = archivo.buffer.toString('base64');
  const respuesta = await fetch(URL_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ENTORNO.ANTHROPIC_API_KEY,
      'anthropic-version': VERSION_API,
    },
    body: JSON.stringify(peticion(imagen, archivo.mimetype)),
  });
  if (!respuesta.ok) throw new ErrorHttp(HTTP.NO_DISPONIBLE, 'El servicio de IA no ha respondido. Rellena los datos a mano.');

  const cuerpo = await respuesta.json();
  const texto = cuerpo.content?.find((parte) => parte.type === 'text')?.text;
  return elegir(extraerJSON(texto), CAMPOS);
};
