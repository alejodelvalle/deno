import { Router } from "../../../deps.ts";
import * as authController from "../controller/auth.controller.ts";
import { jwtAuth } from "../../../middlewares/jwt.ts";

const authRouter = new Router();

authRouter
  .post("/v1/auth/registrarse", authController.registrarse)
  .post("/v1/auth/iniciar-sesion", authController.iniciarSesion)
  .get("/v1/auth/usuario-actual", jwtAuth, authController.getUsuarioActual)
  .post("/v1/auth/cerrar-sesion", jwtAuth, authController.cerrarSesion)
  .get("/v1/auth/url-google", authController.getGoogleAuthUrl)
  .get("/v1/auth/iniciar-sesion-google", authController.iniciarSesionGoogle);

/*
router.get("/book/:id/page/:page", ctx => {
  getQuery(ctx, { mergeParams: true });
});
*/
export default authRouter;
