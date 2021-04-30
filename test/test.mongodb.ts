import { MongoClient, Bson } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';

const config = {
	uri: `mongodb://${Deno.env.get('DB_HOST')}:${Deno.env.get('DB_PORT')}/${Deno.env.get('DB_NAME')}`,
	database: Deno.env.get('DB_NAME') || 'saul',
	user: Deno.env.get('DB_USER'),
	password: Deno.env.get('DB_PASSWORD')
};

const client = new MongoClient();
await client.connect(config.uri);

// Defining schema interface
interface UserSchema {
	_id: { $oid: string };
	username: { type: string; required: true };
	password: string;
}

const db = client.database(config.database);

const users = db.collection<UserSchema>('users');

/*
// insert
export const insertId = await users.insertOne({
	username: 1,
	password: 'pass1'
});

/*
// insertMany
export const insertIds = await users.insertMany([
	{
		username: 'user1',
		password: 'pass1'
	},
	{
		username: 'user2',
		password: 'pass2'
	}
]);

// findOne
export const user1 = await users.findOne({ _id: insertId });

// find
export const all_users = await users.find({ username: { $ne: null } }).toArray();

/*
// find by ObjectId
const user1_id = await users.findOne({
	_id: new Bson.ObjectId('SOME OBJECTID STRING')
});

/*
// count
const count = await users.count({ username: { $ne: null } });

// aggregation
const docs = await users.aggregate([
	{ $match: { username: 'many' } },
	{ $group: { _id: '$username', total: { $sum: 1 } } }
]);

// updateOne
const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
	{ username: { $ne: null } },
	{ $set: { username: 'USERNAME' } }
);

// updateMany
const { matchedCount, modifiedCount, upsertedId } = await users.updateMany(
	{ username: { $ne: null } },
	{ $set: { username: 'USERNAME' } }
);

// deleteOne
const deleteCount = await users.deleteOne({ _id: insertId });

// deleteMany
const deleteCount2 = await users.deleteMany({ username: 'test' });

// Skip
const skipTwo = await users.skip(2).find();

// Limit
const featuredUser = await users.limit(5).find();
*/
