/*
 * Server, logger y middleware,
 *
 */
import 'https://deno.land/x/dotenv/load.ts';

import { bold, cyan, green, yellow } from 'https://deno.land/std@0.94.0/fmt/colors.ts';

import { Application } from 'https://deno.land/x/oak/mod.ts';

import usuarioRouter from './modules/usuario/router.ts';
import notificacionRouter from './modules/notificacion/router/notificacion.router.ts';

//Test MongoDB
import './db/test.mongodb.ts';

const app = new Application();

//Routes
app.use(usuarioRouter.routes());
app.use(usuarioRouter.allowedMethods());
app.use(notificacionRouter.routes());
app.use(notificacionRouter.allowedMethods());

// Logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.headers.get('X-Response-Time');
	console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${bold(String(rt))}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(ctx => {
	ctx.response.body = 'SAUL API Sever';
});

app.addEventListener('listen', ({ hostname, port, serverType }) => {
	console.log(bold('Start listening on ') + yellow(`${hostname}:${port}`));
	console.log(bold('  using HTTP server: ' + yellow(serverType)));
});

await app.listen({ hostname: '127.0.0.1', port: 8000 });
console.log(bold('Finished.'));
