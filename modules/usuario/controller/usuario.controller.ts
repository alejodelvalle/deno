import { Response, Request, Body } from "../../../deps.ts";
import { config } from "../../../config/config.ts";
import * as usuarioModel from "../model/usuario.model.ts";

/**
 * obtener usuario
 * @param {string} _id
 * @return {Object} usuario
 */

export const getById = async ({
  params,
  response,
}: {
  params: { _id: string };
  response: Response;
}) => {
  const usuario = await usuarioModel.getById(params._id);
  if (usuario?.esValido) {
    if (usuario.data) {
      response.body = {
        message: config.api.status.ok.message,
        data: usuario.data,
      };
    } else {
      response.status = config.api.status.notFound.code;
      response.body = { message: config.api.status.notFound.message };
    }
  } else {
    response.status = config.api.status.badRequest.code;
    response.body = {
      message: config.api.status.badRequest.message,
      data: usuario?.data,
    };
  }
};

/**
 * obtener todos los usuarios
 * @param {Response} response
 */
export const getAll = async ({ response }: { response: Response }) => {
  response.status = config.api.status.ok.code;
  response.body = {
    message: config.api.status.ok.message,
    usuarios: await usuarioModel.get(),
  };
};

/**
 * crear usuario
 * @param {Object} Objeto
 * @return {Request} Objeto.request - Request http manejado por oak
 * @return {Response} Objeto.response - Response http manejado por oak
 */
export const create = async ({
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
