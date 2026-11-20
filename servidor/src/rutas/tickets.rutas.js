import { Router } from 'express';
import { ROLES_INTERNOS } from '../../../compartido/index.js';
import * as tickets from '../controladores/tickets.controlador.js';
import { autenticar, autenticacionOpcional, permitir } from '../middlewares/autenticacion.js';
import { validarCuerpo } from '../middlewares/validar.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

const interno = [autenticar, permitir(...ROLES_INTERNOS)];

export const rutasTickets = Router()
  .post('/', autenticacionOpcional, validarCuerpo('ticket'), a(tickets.crear))
  .get('/', ...interno, a(tickets.listar))
  .patch('/:codigo/estado', ...interno, validarCuerpo('estadoTicket'), a(tickets.cambiarEstado))
  .post('/:codigo/respuestas', ...interno, validarCuerpo('respuestaTicket'), a(tickets.responder));
