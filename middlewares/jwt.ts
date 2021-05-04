import { Context } from "../deps.ts";
import { verify } from "../deps.ts";
import { config } from "../config/config.ts";

/**
 * Crear configuracion de JWT
 */

interface JwtConfig {
  header: string;
  schema: string;
  secretKey: any;
  expirationTime: number;
  type: string;
  alg: any;
}

export const jwtConfig: JwtConfig = {
  header: "Authorization",
  schema: "Bearer",
  secretKey: Deno.env.get("JWT_SECRET") || "",
  expirationTime: 60000, //número de segundos
  type: "JWT",
  alg: "HS512",
};

export async function jwtAuth(
  ctx: Context<Record<string, any>>,
  next: () => any
) {
  // Obtener el token de la Cookie
  const jwt = ctx.cookies.get("jwt");

  // responder 401 si el token no viene en el request
  if (!jwt) {
    ctx.response.status = config.api.status.authorizationRequired.code;
    ctx.response.body = {
      message: config.api.status.authorizationRequired.message,
    };
    return;
  }

  // Verificar si el token es válido
  if (!(await verify(jwt, jwtConfig.secretKey, jwtConfig.alg))) {
    ctx.response.status = config.api.status.authorizationRequired.code;
    ctx.response.body = {
      message: `${config.api.status.authorizationRequired.message}, jwt invalido`,
    };
    return;
  }
  // si JWT es correcto, continua y llama a la ruta solicitada
  return next();
}

/*
export async function jwtAuth(
  ctx: Context<Record<string, any>>,
  next: () => Promise<void>
) {
  
  // Get the token from the request
  const token = ctx.request.headers
    .get(jwtConfig.header)
    ?.replace(`${jwtConfig.schema} `, "");

  // reject request if token was not provide
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  // check the validity of the token
  if (!(await verify(token, jwtConfig.secretKey, jwtConfig.alg))) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Wrong Token" };
    return;
  }

  // JWT is correct, so continue and call the private route
  next();
}
*/
