import { Bson } from "../../../deps.ts";
import { genSalt, hash, compare } from "../../../deps.ts";
import usuarioSchema, { UsuarioSchema } from "../schema/usuario.schema.ts";
import {
  validateUsuario,
  validateUsuarioId,
  validateUsuarioSerializedId,
} from "./usuario.validate.ts";

/**
 *Genera el hash para el password
 *
 * @param {string} password
 * @return {*}
 */
const hashPassword = async (password: string) => {
  const salt = await genSalt(8);
  return hash(password, salt);
};

/**
 * crea un usuario
 * @param usuario
 * @returns {esValido,data}
 */
export const create = async (usuario: UsuarioSchema) => {
  const validate = await validateUsuario(usuario);
  if (validate.esValido) {
    const usuarioExiste = await usuarioSchema.findOne({
      email: usuario.email,
    });
    if (usuarioExiste) {
      return {
        esValido: false,
        data: "Correo electrónico existente",
      };
    }
    usuario.password = await hashPassword(usuario.password || "");
    const insertId = await usuarioSchema.insertOne(usuario);
    const nuevoUsuario = await usuarioSchema.findOne({
      _id: insertId,
    });
    return {
      esValido: validate.esValido,
      data: { ...nuevoUsuario, creacion: insertId.getTimestamp() },
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * crea un usuario o lo actualiza si este existe, cuando el registro viene
 * desde una cuenta de algún proveedor de servicio OAuth2 (Google, Facebook, Twitter)
 * @param usuario
 * @returns
 */

export const createUpsert = async (usuario: UsuarioSchema) => {
  const validate = await validateUsuario(usuario);
  if (validate.esValido) {
    const usuarioUpserted: any = await usuarioSchema.updateOne(
      { providerUserId: usuario.providerUserId },
      {
        $set: usuario,
      },
      { upsert: true }
    );
    console.log(
      `${usuarioUpserted.matchedCount} registro encontrado, ${usuarioUpserted.modifiedCount} registro modificado, ${usuarioUpserted.upsertedCount} registro insertado, upsertedId: ${usuarioUpserted.upsertedId}`
    );
    const nuevoUsuario: any = await usuarioSchema.findOne({
      providerUserId: usuario.providerUserId,
    });
    return {
      esValido: validate.esValido,
      data: {
        ...nuevoUsuario,
        creacion: new Bson.ObjectId(nuevoUsuario._id).getTimestamp(),
      },
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * obtener usuario por _id
 * @param _id
 * @returns usuario
 */

export const getById = async (_id: string) => {
  const validate = await validateUsuarioId({ _id });
  if (validate.esValido) {
    const usuario = await usuarioSchema.findOne({
      _id: new Bson.ObjectId(_id),
    });
    if (usuario) {
      return {
        esValido: validate.esValido,
        data: {
          ...usuario,
          creacion: new Bson.ObjectId(_id).getTimestamp(),
        },
      };
    }
    return {
      esValido: validate.esValido,
      data: null,
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * obtener usuario por serializedId
 * @param id
 * @returns usuario
 */

export const getBySerializedId = async (serializedId: number) => {
  const validate = await validateUsuarioSerializedId({ serializedId });
  if (validate.esValido) {
    const usuario = await usuarioSchema.findOne({
      serializedId: serializedId,
    });
    if (usuario) {
      return {
        esValido: validate.esValido,
        data: {
          ...usuario,
          creacion: new Bson.ObjectId(usuario._id).getTimestamp(),
        },
      };
    }
    return {
      esValido: validate.esValido,
      data: null,
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * trae todos usuarios
 * @returns usuarios
 */

export const get = async () => {
  return await usuarioSchema.find({ nombre: { $ne: null } }).toArray();
};
/**
 *
 * @param email
 * @returns {Object}
 */
export const getByEmail = async (email: string) => {
  const usuario: any = await usuarioSchema.findOne({ email: email });
  if (usuario) {
    return {
      esValido: true,
      data: usuario,
    };
  }
  return {
    esValido: false,
    data: { email: "El correo electrónico no existe" },
  };
};

/**
 * Compara el password ingresado por el usuario y el password almacenado en la BD
 * @param {string} password ingresado por el usuario
 * @param {string} usuarioPassword el almacenado en la BD
 * @returns
 */
export const validarPassword = async (
  password: string,
  usuarioPassword: string
) => {
  if (await compare(password, usuarioPassword)) {
    return {
      esValido: true,
      data: null,
    };
  }
  return {
    esValido: false,
    data: { password: "El password es incorrecto" },
  };
};
