import { etiquetaGrado } from '@compartido';
import {
  CONTRASENA_DEMO, DEMO_SERVICIOS, DEMO_USUARIOS, DEMO_PEDIDOS, DEMO_PRODUCTOS, DEMO_TICKETS, haceDias, construirPedidoDemo,
} from '@compartido/demo/datos.js';

/** Construye en memoria las mismas "colecciones" que tendría MongoDB con los datos de demo. */
export const crearBaseDemo = () => {
  const usuarios = DEMO_USUARIOS.map((u, i) => ({
    id: `u${i + 1}`, ...u, contrasena: CONTRASENA_DEMO, activo: true, creadoEn: haceDias(90 - i * 10),
  }));
  const idDe = (email) => usuarios.find((u) => u.email === email).id;

  const servicios = DEMO_SERVICIOS.map((s, i) => ({ id: `s${i + 1}`, activo: true, ...s }));
  const servicioDe = (codigo) => servicios.find((s) => s.codigo === codigo);

  const pedidos = DEMO_PEDIDOS.map((p, i) => ({
    id: `p${i + 1}`, ...construirPedidoDemo(p, servicioDe(p.servicio)), cliente: idDe(p.cliente),
  }));

  const productos = DEMO_PRODUCTOS.map(({ gradeado, pedido, ...p }, i) => ({
    id: `r${i + 1}`, ...p, pedidoCodigo: pedido, etiquetaGrado: etiquetaGrado(p.nota, p.subnotas),
    imagenes: { anverso: null, reverso: null, etiqueta: null }, fechaGradeo: haceDias(gradeado),
  }));

  const tickets = DEMO_TICKETS.map(({ cliente, creado, ...t }, i) => {
    const usuario = usuarios.find((u) => u.email === cliente);
    return { id: `t${i + 1}`, ...t, usuario: usuario.id, nombre: usuario.nombre, email: usuario.email, creadoEn: haceDias(creado) };
  });

  const contadores = { pedido: pedidos.length, ticket: tickets.length, cert: productos.length };

  return { usuarios, servicios, pedidos, productos, tickets, contadores };
};
