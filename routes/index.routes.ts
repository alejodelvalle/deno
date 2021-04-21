import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as indexCtrl from '../controllers/index.controllers.ts';
const router = new Router();

router.get('/', ({ response }) => {
	response.body = 'Hello to my API...';
});

router.get('/users', indexCtrl.getUsers);
router.get('/users/:id', indexCtrl.getUser);
router.post('/users', indexCtrl.createUser);
router.put('/users/:id', indexCtrl.updateUser);

export default router;
