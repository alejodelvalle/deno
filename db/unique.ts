import { invalid, Validity, Rule } from "https://deno.land/x/validasaur/mod.ts";

export function unique(collection: any, column: string): Rule {
  return async function uniqueRule(value: any): Promise<Validity> {
    if (typeof value !== "string" && typeof value !== "number") {
      return invalid("unique", { value, collection, column });
    }
    console.log({ column: column, value: value });
    //const data = await collection.findOne(column: value );
    const data = await collection.findOne({
      [column]: value,
    });
    console.log(data);
    if (data !== null && data !== undefined) {
      return invalid("unique", { value, collection, column });
    }
  };
}
