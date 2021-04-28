import { MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';

const config = {
	uri: `mongodb://${Deno.env.get('DB_HOST')}:${Deno.env.get('DB_PORT')}/${Deno.env.get('DB_NAME')}`,
	database: Deno.env.get('DB_NAME') || 'saul',
	user: Deno.env.get('DB_USER'),
	password: Deno.env.get('DB_PASSWORD')
};

const client = new MongoClient();
await client.connect(config.uri);
const db = client.database(config.database);

export default db;
