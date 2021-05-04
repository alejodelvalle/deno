import { Router } from "../../../deps.ts";
import * as usuarioController from "../controller/usuario.controller.ts";

const usuarioRouter = new Router();

usuarioRouter
  .get("/v1/usuario", usuarioController.getAll)
  .get("/v1/usuario/:_id", usuarioController.getById)
  .post("/v1/usuario", usuarioController.create);

export default usuarioRouter;
