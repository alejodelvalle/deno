import { Bson, MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';

const client = new MongoClient();
await client.connect('mongodb://localhost:27017');
const db = client.database('saul');

export default db;
