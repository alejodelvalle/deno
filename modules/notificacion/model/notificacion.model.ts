import notificacionSchema, { NotificacionSchema } from '../schema/notificacion.schema.ts';
import { Bson } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';
import { validateNotificacion, validateNotificacionId } from './notificacion.validate.ts';
import * as config from '../notificacion.config.ts';
import { v4 } from 'https://deno.land/std@0.94.0/uuid/mod.ts';
import * as emailClient from './notificacion.email.ts';
/**
 * crear notificacion
 * @param notificacion
 * @returns {esValido,data}
 */

export const create = async (notificacion: NotificacionSchema) => {
	const validate = await validateNotificacion(notificacion);
	notificacion.estado = config.estados.pendiente;
	//	notificacion.log = [{ fecha: new Date(), detalle: 'Creación' }];

	if (notificacion.tipo === config.tipos.email) {
		notificacion.tokenConfirmacion = v4.generate();
	}
	if (validate.esValido) {
		const insertId = await notificacionSchema.insertOne(notificacion);
		const nuevaNotificacion = await notificacionSchema.findOne({ _id: insertId });
		if (notificacion.tipo === config.tipos.email) {
			emailClient.enviar(nuevaNotificacion);
		}
		return {
			esValido: validate.esValido,
			data: { ...nuevaNotificacion, creacion: insertId.getTimestamp() }
		};
	}
	return {
		esValido: validate.esValido,
		data: validate.errores
	};
};

/**
 * obtener notificacion por _id
 * @param id
 * @returns notificacion
 */

export const getById = async (id: string) => {
	const validate = await validateNotificacionId({ id });
	if (validate.esValido) {
		const notificacion = await notificacionSchema.findOne({ _id: new Bson.ObjectId(id) });
		if (notificacion) {
			return {
				esValido: validate.esValido,
				data: { ...notificacion, creacion: new Bson.ObjectId(id).getTimestamp() }
			};
		}
		return {
			esValido: validate.esValido,
			data: null
		};
	}
	return {
		esValido: validate.esValido,
		data: validate.errores
	};
};

/**
 * obtener notificaciones
 */

export const get = async () => {
	return await notificacionSchema.find({ titulo: { $ne: null } }).toArray();
};

/**
 * Actualiza el estado de una notificación
 * @param id
 */

export const updateEstado = async (id: string, estado: string, modificacion: string, origen: string) => {
	const validate = await validateNotificacionId({ id });
	if (validate.esValido) {
		const notificacion: any = await notificacionSchema.findOne({ _id: new Bson.ObjectId(id) });

		if (notificacion) {
			let log = notificacion.log;
			if (log === undefined) {
				log = [];
			}
			console.log(notificacion);
			log.push({ fecha: new Date(), detalle: modificacion, origen: origen });
			const { matchedCount, modifiedCount, upsertedId } = await notificacionSchema.updateOne(
				{ _id: new Bson.ObjectId(id) },
				[
					{
						$set: {
							log: log,
							estado: estado,
							ultimaModificacion: '$$NOW'
						}
					}
				]
			);
			console.log(`${matchedCount} registro encontrado, ${modifiedCount} registro modificado`);
			const updatedNotificacion = await notificacionSchema.findOne({ _id: new Bson.ObjectId(id) });
			//return { ...updatedNotificacion, creacion: new Bson.ObjectId(id).getTimestamp() };
			return {
				esValido: validate.esValido,
				data: { ...updatedNotificacion, creacion: new Bson.ObjectId(id).getTimestamp() }
			};
		}
		return {
			esValido: validate.esValido,
			data: null
		};
	}
	return {
		esValido: validate.esValido,
		data: validate.errores
	};
};
