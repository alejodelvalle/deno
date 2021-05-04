import db from "../../../db/mongodb.ts";

export interface UsuarioSchema {
  _id: { $oid: string };
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  email: string;
  provider: string;
  providerUserId: { type: string; unique: true };
  serializedId: number;
  foto: string;
  password?: string;
  log: [
    {
      fecha: Date;
      detalle: string;
      origen: string;
    }
  ];
}

const usuarioSchema = db.collection<UsuarioSchema>("usuario");

export default usuarioSchema;
