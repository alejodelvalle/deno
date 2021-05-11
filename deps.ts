// Copyright 2021-2023 SAUL. Alcaldía de Santiago de Cali, todos los derechos reservados

// Este archivo contiene las dependencias externas que se requieren en SAUL

export {
  bold,
  cyan,
  green,
  yellow,
} from "https://deno.land/std@0.94.0/fmt/colors.ts";
export {
  Application,
  Context,
  Response,
  Cookies,
  helpers,
  Request,
} from "https://deno.land/x/oak/mod.ts";
export type { Body } from "https://deno.land/x/oak/mod.ts";
export { oakCors } from "https://deno.land/x/cors/mod.ts";
export { DashportOak } from "https://deno.land/x/dashport@v1.2.1/mod.ts";
export {
  create as jwtCreate,
  verify as jwtVerify,
  getNumericDate as jwtGetNumericDate,
} from "https://deno.land/x/djwt@v2.2/mod.ts";
export { MongoClient, Bson } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
export {
  validate,
  required,
  isDate,
  firstMessages,
  isString,
  lengthBetween,
  isIn,
  isEmail,
  isNumeric,
  requiredIf,
} from "https://deno.land/x/validasaur/mod.ts";
export type { InvalidParams } from "https://deno.land/x/validasaur/mod.ts";
export { Router } from "https://deno.land/x/oak/mod.ts";
export { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
export { v4 } from "https://deno.land/std@0.94.0/uuid/mod.ts";
export { genSalt, hash, compare } from "https://deno.land/x/bcrypt/mod.ts";
