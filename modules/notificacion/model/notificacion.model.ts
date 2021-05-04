import { Bson } from "../../../deps.ts";
import * as authConfig from "../notificacion.config.ts";
import notificacionSchema, {
  NotificacionSchema,
} from "../schema/notificacion.schema.ts";
import {
  validateNotificacion,
  validateNotificacionId,
} from "./notificacion.validate.ts";
import * as emailClient from "./notificacion.email.ts";

/**
 * crear una notificacion
 * @param notificacion
 * @returns {esValido: boolean,data : {}}
 */

export const create = async (notificacion: NotificacionSchema) => {
  const validate = await validateNotificacion(notificacion);
  notificacion.estado = authConfig.estados.pendiente;
  //	notificacion.log = [{ fecha: new Date(), detalle: 'Creación' }];

  if (notificacion.tipo === authConfig.tipos.email) {
    //notificacion.tokenConfirmacion = v4.generate();
  }
  if (validate.esValido) {
    const insertId = await notificacionSchema.insertOne(notificacion);
    const nuevaNotificacion = await notificacionSchema.findOne({
      _id: insertId,
    });
    if (notificacion.tipo === authConfig.tipos.email) {
      emailClient.enviar(nuevaNotificacion);
    }
    return {
      esValido: validate.esValido,
      data: { ...nuevaNotificacion, creacion: insertId.getTimestamp() },
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * obtener notificacion por _id
 * @param _id
 * @returns notificacion
 */

export const getById = async (_id: string) => {
  const validate = await validateNotificacionId({ _id });
  if (validate.esValido) {
    const notificacion = await notificacionSchema.findOne({
      _id: new Bson.ObjectId(_id),
    });
    if (notificacion) {
      return {
        esValido: validate.esValido,
        data: {
          ...notificacion,
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
 * obtener notificaciones
 */

export const getAll = async () => {
  return await notificacionSchema.find({ titulo: { $ne: null } }).toArray();
};

/**
 * Actualiza el estado de una notificación
 * @param _id
 */

export const updateEstado = async (
  _id: string,
  estado: string,
  modificacion: string,
  origen: string
) => {
  const validate = await validateNotificacionId({ _id });
  if (validate.esValido) {
    const notificacion: any = await notificacionSchema.findOne({
      _id: new Bson.ObjectId(_id),
    });

    if (notificacion) {
      let log = notificacion.log;
      if (log === undefined) {
        log = [];
      }
      console.log(notificacion);
      log.push({ fecha: new Date(), detalle: modificacion, origen: origen });
      const {
        matchedCount,
        modifiedCount,
        upsertedId,
      } = await notificacionSchema.updateOne({ _id: new Bson.ObjectId(_id) }, [
        {
          $set: {
            log: log,
            estado: estado,
            ultimaModificacion: "$$NOW",
          },
        },
      ]);
      console.log(
        `${matchedCount} registro encontrado, ${modifiedCount} registro modificado`
      );
      const updatedNotificacion = await notificacionSchema.findOne({
        _id: new Bson.ObjectId(_id),
      });
      return {
        esValido: validate.esValido,
        data: {
          ...updatedNotificacion,
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
