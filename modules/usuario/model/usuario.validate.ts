import {
  validate,
  required,
  isDate,
  firstMessages,
  isString,
  lengthBetween,
  isIn,
  isEmail,
  isNumeric,
} from "../../../deps.ts";
import { UsuarioSchema } from "../schema/usuario.schema.ts";

/**
 * Valida los campos de un Objeto usuario para el registro de una cuenta local estandar (password obligatorio) o
 * para el registro de una cuenta que utiliza algún proveedor de servicio OAuth2 (Google, Facebook, Twitter) (password opcional)
 * @param {Object} usuario - el usuario a validar
 * @param {string} usuario.nombre - el nombre del usuario
 * @param {string} usuario.apellido - el apellido del usuario
 * @param {string} usuario.email - el email del usuario
 * @param {string} usuario.password - el password del usuario
 * @param {boolean} OAuth2Provider - el tipo de registro del usuario, si el registro se hace desde una cuenta de algún proveedor de servicio OAuth2, este debe ir en true
 *
 * @returns {Object} Objeto - resultado de la validación
 * @returns {boolean} Objeto.esValido - true o false
 * @returns {boolean} Objeto.errores - {campo: 'detalle del error'}
 */
export const validateUsuario = async (
  usuario: UsuarioSchema,
  OAuth2Provider: boolean = false
) => {
  const rules = {
    nombre: [required, isString],
    apellido: [required, isString],
    email: [required, isEmail],
  };
  const [esValido, error] = await validate(
    usuario,
    OAuth2Provider ? rules : { ...rules, password: required },
    {
      messages: {
        "nombre.required": "El nombre es requerido",
        "nombre.isString": "El nombre no es valido, debe contener solo letras",
        "apellido.required": "El apellido es requerido",
        "apellido.isString":
          "El apellido no es valido, debe contener solo letras",
        "password.required": "El password es requerido",
        "email.required": "El email es requerido",
        "email.isEmail": "El email no tiene un formato válido",
      },
    }
  );
  const errores = firstMessages(error);
  return { esValido, errores };
};

/**
 * Valida el campo _id de un Objeto usuario
 * @param {Object} usuario - el usuario a validar
 * @param {string} usuario._id - el _id del usuario
 *
 * @returns {Object} Objeto - resultado de la validación
 * @returns {boolean} Objeto.esValido - true o false
 * @returns {boolean} Objeto.errores - {_id: 'detalle del error'}
 */
export const validateUsuarioId = async (usuario: { _id: string }) => {
  const [esValido, error] = await validate(
    usuario,
    {
      _id: [required, isString, lengthBetween(24, 24)],
    },
    {
      messages: {
        "_id.required": "El id es requerido",
        "_id.lengthBetween": "El id no es valido",
      },
    }
  );
  const errores = firstMessages(error);
  return { esValido, errores };
};

export const validateUsuarioSerializedId = async (usuario: {
  serializedId: number;
}) => {
  const [esValido, error] = await validate(
    usuario,
    {
      serializedId: [required, isNumeric],
    },
    {
      messages: {
        "serializedId.required": "El serializedId es requerido",
        "serializedId.isNumeric": "El serializedId debe ser numerico",
      },
    }
  );
  const errores = firstMessages(error);
  return { esValido, errores };
};
