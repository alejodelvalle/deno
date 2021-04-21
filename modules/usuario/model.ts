import db from '../../db/mongodb.ts';

// Defining schema interface
interface UserSchema {
	_id: { $oid: string };
	name: string;
}

const users = db.collection<UserSchema>('usuarios');

// insert
export const addUser = async (name: string) =>
	await users.insertOne({
		name: name
	});

// findAll
export const getAll = await users.find({ name: { $ne: null } }).toArray();
