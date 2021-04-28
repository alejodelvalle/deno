import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as controller from './controller.ts';
const usuarioRouter = new Router();

usuarioRouter.get('/users', controller.getUsers);
usuarioRouter.get('/users/:id', controller.getUser);
usuarioRouter.post('/users', controller.createUser);
usuarioRouter.put('/users/:id', controller.updateUser);

export default usuarioRouter;
