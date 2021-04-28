import db from '../../../db/mongodb.ts';
import { Bson } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';

export interface NotificacionSchema {
	_id: { $oid: string };
	titulo: string;
	tipo: string;
	email: string;
	telefono: string;
	estado: string;
	contenido: string;
	tokenConfirmacion: string; // URL de redirección para la confirmacion de la lectura de la notificación
	expira: Date;
	log: [
		{
			fecha: Date;
			detalle: string;
			origen: string;
		}
	];
}

const notificacionSchema = db.collection<NotificacionSchema>('notificacion');

export default notificacionSchema;
