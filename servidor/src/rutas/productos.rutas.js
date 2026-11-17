import { Router } from 'express';
import { ROLES_INTERNOS } from '../../../compartido/index.js';
import * as productos from '../controladores/productos.controlador.js';
import { autenticar, permitir } from '../middlewares/autenticacion.js';
import { leerDatosMultipart, validarCuerpo } from '../middlewares/validar.js';
import { subirFotosProducto } from '../middlewares/subida.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';
import { limitarIntentos } from '../middlewares/limitarIntentos.js';

export const rutasProductos = Router()
  .get('/:idCertificado', a(productos.consultar))
  .get('/:idCertificado/codigo-uv', autenticar, permitir(...ROLES_INTERNOS), a(productos.verCodigoUV))
  .post('/:idCertificado/verificar-uv', limitarIntentos(), validarCuerpo('verificarUV'), a(productos.verificarUV))
  .post(
    '/',
    autenticar,
    permitir(...ROLES_INTERNOS),
    subirFotosProducto,
    leerDatosMultipart,
    validarCuerpo('producto'),
    a(productos.crear),
  );
