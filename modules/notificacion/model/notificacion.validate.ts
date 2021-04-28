import {
	validate,
	InvalidParams,
	required,
	isDate,
	firstMessages,
	isString,
	lengthBetween,
	isIn,
	isEmail,
	isNumeric
} from 'https://deno.land/x/validasaur/mod.ts';
import * as config from '../notificacion.config.ts';
import { NotificacionSchema } from '../schema/notificacion.schema.ts';

/**
 * Valida la entrada de datos para la creacion de una notificacion de acuerdo a las reglas establecidas
 *
 * @param {{ titulo: string; contenido: string; fechaExpiracion: Date }} inputs
 * @return {*}
 */

export const validateNotificacion = async (inputs: NotificacionSchema) => {
	const rules = {
		titulo: [required, isString],
		tipo: [required, isString, isIn([config.tipos.app, config.tipos.email, config.tipos.sms])],
		email: [isEmail],
		telefono: [isNumeric, lengthBetween(10, 10)],
		estado: [isString, isIn([config.estados.pendiente, config.estados.leida])],
		contenido: [required, isString],
		expira: [required, isDate]
	};
	if (inputs.tipo === config.tipos.email) {
		rules.email.unshift(required);
	}
	if (inputs.tipo === config.tipos.sms) {
		rules.telefono.unshift(required);
	}
	const [esValido, error] = await validate(inputs, rules, {
		messages: {
			'titulo.required': 'El titulo es requerido',
			'titulo.isString': 'El titulo no es valido, debe ser de tipo texto',
			'tipo.required': 'El tipo es requerido',
			'email.required': 'El email es requerido para el tipo de notificación por Email',
			'email.isEmail': 'El email no tiene un formato válido',
			'telefono.required': 'El número de teléfono móvil es requerido para el tipo de notificación por SMS',
			'telefono.isNumeric': 'El número de teléfono móvil debe ser numérico',
			'telefono.lengthBetween': 'El número de teléfono móvil no tiene un formato valido',
			'contenido.required': 'El contenido es requerido',
			'contenido.isString': 'El contenido no es válido, debe ser de tipo texto',
			'expira.required': 'La fecha de expiración es requerida',
			'expira.isDate': 'La fecha de expiración no es válida',
			// Using function
			isIn: (params: InvalidParams): string => {
				const allowedValues = params.allowedValues.join(' | ');
				return `El valor '${params.value}' no es permitido,  solo se permite uno de estos valores ${allowedValues}`;
			}
			// Use this if you want same message for any rule fail
			// "age": "Usia tidak valid",
		}
	});
	const errores = firstMessages(error);
	return { esValido, errores };
};

export const validateNotificacionId = async (inputs: { id: string }) => {
	const [esValido, error] = await validate(
		inputs,
		{
			id: [required, isString, lengthBetween(24, 24)]
		},
		{
			messages: {
				'id.required': 'El id es requerido',
				'id.lengthBetween': 'El id no es valido'
			}
		}
	);
	const errores = firstMessages(error);
	return { esValido, errores };
};
