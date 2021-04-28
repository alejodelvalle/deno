import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as notificacionController from '../controller/notificacion.controller.ts';

const notificacionRouter = new Router();
notificacionRouter.get('/v1/notificaciones', notificacionController.getNotificaciones);
notificacionRouter.get('/v1/notificaciones/:id', notificacionController.getNotificacion);
notificacionRouter.post('/v1/notificaciones', notificacionController.createNotificacion);
notificacionRouter.put('/v1/notificaciones/:id/confirmar-lectura', notificacionController.confirmarLectura);

export default notificacionRouter;
