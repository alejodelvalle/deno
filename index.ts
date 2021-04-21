import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

import usuarioRouter from './modules/usuario/router.ts';

const app = new Application();

app.use(usuarioRouter.routes());
app.use(usuarioRouter.allowedMethods());

console.log('Server running on port', 5000);
await app.listen({ port: 5000 });
