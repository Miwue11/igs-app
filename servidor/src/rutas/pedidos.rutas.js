import { Router } from 'express';
import { ROLES, ROLES_INTERNOS } from '../../../compartido/index.js';
import * as pedidos from '../controladores/pedidos.controlador.js';
import * as productos from '../controladores/productos.controlador.js';
import { autenticar, permitir } from '../middlewares/autenticacion.js';
import { validarCuerpo } from '../middlewares/validar.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

const interno = [autenticar, permitir(...ROLES_INTERNOS)];
const cliente = [autenticar, permitir(ROLES.CLIENTE)];

export const rutasPedidos = Router()
  .post('/', ...cliente, validarCuerpo('pedido'), a(pedidos.crear))
  .get('/mios', ...cliente, a(pedidos.mios))
  .get('/cola', ...interno, a(pedidos.cola))
  .patch('/:codigo/estado', ...interno, validarCuerpo('estadoPedido'), a(pedidos.cambiarEstado))
  .post('/:codigo/articulos/:indice/no-gradeable', ...interno, validarCuerpo('noGradeable'), a(pedidos.noGradeable))
  .get('/:codigo/productos', ...interno, a(productos.dePedido));
