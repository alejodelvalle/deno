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
  isNumeric,
} from "../../../deps.ts";
import * as authConfig from "../notificacion.config.ts";
import { NotificacionSchema } from "../schema/notificacion.schema.ts";

/**
 * Valida los campos de un Objeto notificación para su posterior registro
 * @param {Object} notificacion - el notificación a validar
 * @param {string} notificacion.titulo - el título de la notificación
 * @param {string} notificacion.tipo - el tipo de notificación [app | email | sms]
 * @param {string} notificacion.email - el email de la notificación, solo aplica para el tipo de notificacion email
 * @param {string} notificacion.estado - el estado de la notificación [pendiente | leída]
 * @param {string} notificacion.contenido - el contenido de la notificación
 * @param {Date} notificacion.expira - la fecha de expiración de la notificación (Date)
 *
 * @returns {Object} Objeto - resultado de la validación
 * @returns {boolean} Objeto.esValido - true o false
 * @returns {boolean} Objeto.errores - {campo: 'detalle del error'}
 */
export const validateNotificacion = async (
  notificacion: NotificacionSchema
) => {
  const rules = {
    titulo: [required, isString],
    tipo: [
      required,
      isString,
      isIn([
        authConfig.tipos.app,
        authConfig.tipos.email,
        authConfig.tipos.sms,
      ]),
    ],
    email: [isEmail],
    telefono: [isNumeric, lengthBetween(10, 10)],
    estado: [
      isString,
      isIn([authConfig.estados.pendiente, authConfig.estados.leida]),
    ],
    contenido: [required, isString],
    expira: [required, isDate],
  };
  if (notificacion.tipo === authConfig.tipos.email) {
    rules.email.unshift(required);
  }
  if (notificacion.tipo === authConfig.tipos.sms) {
    rules.telefono.unshift(required);
  }
  const [esValido, error] = await validate(notificacion, rules, {
    messages: {
      "titulo.required": "El titulo es requerido",
      "titulo.isString": "El titulo no es valido, debe ser de tipo texto",
      "tipo.required": "El tipo es requerido",
      "email.required":
        "El email es requerido para el tipo de notificación por Email",
      "email.isEmail": "El email no tiene un formato válido",
      "telefono.required":
        "El número de teléfono móvil es requerido para el tipo de notificación por SMS",
      "telefono.isNumeric": "El número de teléfono móvil debe ser numérico",
      "telefono.lengthBetween":
        "El número de teléfono móvil no tiene un formato valido",
      "contenido.required": "El contenido es requerido",
      "contenido.isString": "El contenido no es válido, debe ser de tipo texto",
      "expira.required": "La fecha de expiración es requerida",
      "expira.isDate": "La fecha de expiración no es válida",
      // Using function
      isIn: (params: InvalidParams): string => {
        const allowedValues = params.allowedValues.join(" | ");
        return `El valor '${params.value}' no es permitido,  solo se permite uno de estos valores ${allowedValues}`;
      },
      // Use this if you want same message for any rule fail
      // "age": "Usia tidak valid",
    },
  });
  const errores = firstMessages(error);
  return { esValido, errores };
};

export const validateNotificacionId = async (notificacion: { _id: string }) => {
  const [esValido, error] = await validate(
    notificacion,
    {
      _id: [required, isString, lengthBetween(24, 24)],
    },
    {
      messages: {
        "_id.required": "El _id es requerido",
        "_id.lengthBetween": "El _id no es valido",
      },
    }
  );
  const errores = firstMessages(error);
  return { esValido, errores };
};
