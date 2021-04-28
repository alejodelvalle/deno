import { Response, Request, Body } from 'https://deno.land/x/oak/mod.ts';
import * as notificacionModel from '../model/notificacion.model.ts';
import config from '../../../config/config.ts';
import * as notificacionConfig from '../notificacion.config.ts';

/**
 *
 * @param param0
 */
export const getNotificacion = async ({ params, response }: { params: { id: string }; response: Response }) => {
	const notificacion = await notificacionModel.getById(params.id);
	if (notificacion?.esValido) {
		if (notificacion.data) {
			response.body = {
				message: config.api.status.ok.message,
				data: notificacion.data
			};
		} else {
			response.status = config.api.status.notFound.code;
			response.body = { message: config.api.status.notFound.message };
		}
	} else {
		response.status = config.api.status.badRequest.code;
		response.body = {
			message: config.api.status.badRequest.message,
			data: notificacion?.data
		};
	}
};

/**
 * obtener notificaciones
 * @param param0
 */
export const getNotificaciones = async ({ response }: { response: Response }) => {
	response.status = config.api.status.ok.code;
	response.body = {
		message: config.api.status.ok.message,
		notificaciones: await notificacionModel.get()
	};
};

/**
 * crear notificacion
 * @param param0
 */
export const createNotificacion = async ({ request, response }: { request: Request; response: Response }) => {
	if (!request.hasBody) {
		response.status = config.api.status.badRequest.code;
		response.body = { message: config.api.status.badRequest.message };
	} else {
		try {
			const body: Body = await request.body();
			const notificacion = await body.value;
			const nuevaNotificacion = await notificacionModel.create(notificacion);
			if (nuevaNotificacion?.esValido) {
				response.status = config.api.status.created.code;
				response.body = {
					message: config.api.status.created.message,
					data: nuevaNotificacion.data
				};
			} else {
				response.status = config.api.status.badRequest.code;
				response.body = {
					message: config.api.status.badRequest.message,
					data: nuevaNotificacion?.data
				};
			}
		} catch (error) {
			console.error(error);
			response.status = config.api.status.InternalServerError.code;
			response.body = { message: config.api.status.InternalServerError.message };
		}
	}
};

export const confirmarLectura = async ({
	params,
	request,
	response
}: {
	params: { id: string };
	request: Request;
	response: Response;
}) => {
	/*	if (!userFound) {
		response.status = 404;
		response.body = {
			message: 'Usuario no encontrado'
		};
	} else {
		const body = await request.body();
		const updatedUser = await body.value;

		notificaciones = notificaciones.map(user => (user.id === params.id ? { ...user, ...updatedUser } : user));

		response.status = 200;
		response.body = {
			message: 'Usuario Actualizado',
			notificaciones
		};
	}*/

	try {
		const updatedNotificacion = await notificacionModel.updateEstado(
			params.id,
			notificacionConfig.estados.leida,
			'Notificación leída',
			request.ip
		);

		if (updatedNotificacion?.esValido) {
			if (updatedNotificacion.data) {
				response.status = config.api.status.ok.code;
				response.body = {
					message: config.api.status.ok.message,
					data: updatedNotificacion.data
				};
			} else {
				response.status = config.api.status.notFound.code;
				response.body = { message: config.api.status.notFound.message };
			}
		} else {
			response.status = config.api.status.badRequest.code;
			response.body = {
				message: config.api.status.badRequest.message,
				data: updatedNotificacion?.data
			};
		}
	} catch (error) {
		console.error(error);
		response.status = config.api.status.InternalServerError.code;
		response.body = { message: config.api.status.InternalServerError.message };
	}
};
