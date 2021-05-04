import { Response, Request, Cookies, helpers, Body } from "../../../deps.ts";
import { config } from "../../../config/config.ts";
import * as authModel from "../model/auth.model.ts";
import * as usuarioModel from "../../usuario/model/usuario.model.ts";
import { jwtConfig } from "../../../middlewares/jwt.ts";
import { verify } from "../../../deps.ts";

/**
 * genera la URL de autenticacion de Google
 * @param {redirect_uri} URI de Callback para recibir el code de Google
 * @return devuelve un objeto json {url: "http://googleAuthUrl.."}
 */

export const getGoogleAuthUrl = async ({
  response,
}: {
  params: { redirect_uri: string };
  response: Response;
}) => {
  try {
    response.status = config.api.status.ok.code;
    response.body = {
      message: config.api.status.ok.message,
      data: authModel.getGoogleAuthUrl(),
    };
  } catch (error) {
    console.error(error);
    response.status = config.api.status.InternalServerError.code;
    response.body = { message: config.api.status.InternalServerError.message };
  }
};

/**
 * iniciar sesion con Google
 * @param code: string codigo de acceso generado por Googel y recibido enla URI de callback
 * @returns {jwt: string} Json Web Token, la autenticacion se realiza a traves de Cookies (httpOnly)
 */

export const iniciarSesionGoogle = async (ctx: any) => {
  const request = ctx.request;
  const response = ctx.response;
  const cookies = ctx.cookies;
  const params = helpers.getQuery(ctx, { mergeParams: true });
  try {
    console.log(params);
    const googleAuthResponse = await authModel.getGoogleAccessToken(
      params.code
    );
    if (!googleAuthResponse.esValido) {
      response.status = config.api.status.badRequest.code;
      response.body = {
        message: config.api.status.badRequest.message,
        data: googleAuthResponse.data,
      };
    } else {
      const googleAuthProfile = await authModel.getGoogleProfile(
        googleAuthResponse.data.accessToken
      );
      if (!googleAuthProfile.esValido) {
        response.status = config.api.status.badRequest.code;
        response.body = {
          message: config.api.status.badRequest.message,
          data: googleAuthProfile.data,
        };
      }
      cookies.set("jwt", googleAuthProfile.data.jwt, { httpOnly: true });
      response.status = config.api.status.ok.code;
      response.body = {
        message: config.api.status.ok.message,
        data: googleAuthProfile.data,
      };
      //response.redirect("http://localhost:3000");
    }
  } catch (error) {
    console.error(error);
    response.status = config.api.status.InternalServerError.code;
    response.body = { message: config.api.status.InternalServerError.message };
  }
};

export const iniciarSesion = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  if (!request.hasBody) {
    response.status = config.api.status.badRequest.code;
    response.body = { message: config.api.status.badRequest.message };
  } else {
    try {
      const body: Body = await request.body();
      const usuario = await body.value;
      const usuarioExiste = await usuarioModel.getByEmail(usuario.email);
      if (!usuarioExiste?.esValido) {
        response.status = config.api.status.notFound.code;
        response.body = {
          message: config.api.status.notFound.message,
          data: usuarioExiste?.data,
        };
        return;
      }
      const passwordCorrecto = await usuarioModel.validarPassword(
        usuario.password,
        usuarioExiste.data.password
      );
      console.log(passwordCorrecto);
      if (!passwordCorrecto.esValido) {
        response.status = config.api.status.authorizationRequired.code;
        response.body = {
          message: config.api.status.authorizationRequired.message,
          data: passwordCorrecto.data,
        };
        return;
      }
      response.status = config.api.status.ok.code;
      response.body = {
        message: config.api.status.ok.message,
        data: usuarioExiste.data,
      };
    } catch (error) {
      console.error(error);
      response.status = config.api.status.InternalServerError.code;
      response.body = {
        message: config.api.status.InternalServerError.message,
      };
    }
  }
};

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */
export const registrarse = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  if (!request.hasBody) {
    response.status = config.api.status.badRequest.code;
    response.body = { message: config.api.status.badRequest.message };
  } else {
    try {
      const body: Body = await request.body();
      const usuario = await body.value;
      const nuevoUsuario = await usuarioModel.create(usuario);
      if (nuevoUsuario?.esValido) {
        response.status = config.api.status.created.code;
        response.body = {
          message: config.api.status.created.message,
          data: nuevoUsuario.data,
        };
      } else {
        response.status = config.api.status.badRequest.code;
        response.body = {
          message: config.api.status.badRequest.message,
          data: nuevoUsuario?.data,
        };
      }
    } catch (error) {
      console.error(error);
      response.status = config.api.status.InternalServerError.code;
      response.body = {
        message: config.api.status.InternalServerError.message,
      };
    }
  }
};

export const cerrarSesion = async ({
  response,
  cookies,
}: {
  response: Response;
  cookies: Cookies;
}) => {
  const jwt = cookies.get("jwt");

  console.log(jwt);
};

/**
 * obtener el usuario autenticado enla sesion actual
 * @param jwt en cookie session
 * @returns {usuario}
 */
export const getUsuarioActual = async ({
  response,
  cookies,
}: {
  response: Response;
  cookies: Cookies;
}) => {
  const jwt = cookies.get("jwt") || "";

  //traer datos del usuario con el _id y enviarlos
  const payload: any = await verify(jwt, jwtConfig.secretKey, jwtConfig.alg);
  const usuario = await usuarioModel.getById(payload._id);
  if (!usuario.esValido) {
    response.status = config.api.status.badRequest.code;
    response.body = {
      message: config.api.status.badRequest.message,
      data: usuario.data,
    };
    return;
  }
  response.status = config.api.status.ok.code;
  response.body = {
    message: config.api.status.ok.message,
    data: usuario.data,
  };
};
