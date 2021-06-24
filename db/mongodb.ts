import { MongoClient } from "../deps.ts";

const config = {
  uri: `mongodb://${Deno.env.get("DB_HOST")}:${Deno.env.get(
    "DB_PORT"
  )}/${Deno.env.get("DB_NAME")}`,
  database: Deno.env.get("DB_NAME") || "saul",
};

const client = new MongoClient();
await client.connect(config.uri);
const db = client.database(config.database);

export default db;
