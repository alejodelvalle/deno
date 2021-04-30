import { Application } from 'https://deno.land/x/oak/mod.ts';
import { DashportOak } from 'https://deno.land/x/dashport@v1.2.1/mod.ts';
import { googStrat } from '../../../config/dashportConfig.ts';

import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as notificacionController from '../controller/notificacion.controller.ts';

const app = new Application();
//const dashport = new DashportOak(app);
const notificacionRouter = new Router();

/*notificacionRouter.get(
	'/v1/private',
	(dashport.authenticate(googStrat),
	async (ctx: any, next: any) => {
		ctx.response.body = 'This is a private page!';
	})
);
*/
notificacionRouter.get('/v1/notificaciones', notificacionController.getNotificaciones);
notificacionRouter.get('/v1/notificaciones/:id', notificacionController.getNotificacion);
notificacionRouter.post('/v1/notificaciones', notificacionController.createNotificacion);
notificacionRouter.put('/v1/notificaciones/:id/confirmar-lectura', notificacionController.confirmarLectura);

export default notificacionRouter;
