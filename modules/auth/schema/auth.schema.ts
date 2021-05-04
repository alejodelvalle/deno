import db from "../../../db/mongodb.ts";

export interface authSchema {
  _id: { $oid: string };
  nombre: string;
  email: string;
}

const authSchema = db.collection<authSchema>("auth");

export default authSchema;
