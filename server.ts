/*
 * Server, logger y middleware,
 *
 */
import "https://deno.land/x/dotenv/load.ts";
import { bold, cyan, green, yellow } from "./deps.ts";
import { Application } from "./deps.ts";
import { oakCors } from "./deps.ts";
import { DashportOak } from "./deps.ts";

import authRouter from "./modules/auth/router/auth.router.ts";
import usuarioRouter from "./modules/usuario/router/usuario.router.ts";
import notificacionRouter from "./modules/notificacion/router/notificacion.router.ts";
import { googleAuth } from "./modules/auth/auth.config.ts";
import { serializer, deserializer } from "./modules/auth/model/auth.model.ts";

const app = new Application();
const dashport = new DashportOak(app);
/*
notificacionRouter.get(
  "/v1/auth/google",
  dashport.authenticate(googStrat, serializerA, deserializerA) as any,
  async (ctx: any, next: any) => {
    ctx.response.body = "This is a private page!";
  }
);

notificacionRouter.get(
  "/v1/auth/google/callback",
  dashport.authenticate(googStrat, serializerA, deserializerA) as any,
  async (ctx: any, next: any) => {
    if (ctx.locals instanceof Error) {
      ctx.response.body = "An Error occurred!";
    } else {
      const displayName = ctx.locals.displayName;
      ctx.response.body = `Welcome ${displayName}!`;
    }
  }
);
*/
/*
authRouter.get(
  "/private",
  dashport.authenticate(googleAuth, serializer, deserializer) as any,
  async (ctx: any, next: any) => {
    ctx.response.body = "This is a private page!";
  }
);

authRouter.get(
  "/home",
  dashport.authenticate(googleAuth, serializer, deserializer) as any,
  async (ctx: any, next: any) => {
    if (ctx.locals instanceof Error) {
      ctx.response.body = "An Error occurred!";
    } else {
      const nombre = ctx.locals.nombreCompleto;
      ctx.response.body = `Bienvenido ${nombre}!`;
    }
  }
);

authRouter.get(
  "/v1/auth/google",
  dashport.authenticate(googleAuth, serializer, deserializer) as any,
  async (ctx: any, next: any) => {
    try {
      ctx.response.body = config.api.status.authorizationRequired.message;
    } catch (error) {
      console.error(error);
    }
  }
);

authRouter.get(
  "/v1/auth/google/callback",
  dashport.authenticate(googleAuth, serializer, deserializer) as any,
  async (ctx: any, next: any) => {
    if (ctx.locals instanceof Error) {
      ctx.response.body = "An Error occurred!";
    } else {
      const nombre = ctx.locals.nombreCompleto;
      //ctx.response.body = `Bienvenido ${nombre}!`;
      ctx.response.body = ctx;
      ctx.response.redirect("/home");
    }
    console.log(ctx);
    console.log("Google Auth Callback");
    //se debe escribir en la Cookie ???
  }
);
*/
app.use(
  oakCors({
    origin: "http://localhost:3000", ///^.+localhost:(3000|4000|8000)$/
    credentials: true,
  })
);

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${bold(
      String(rt)
    )}`
  );
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

//Routes
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(usuarioRouter.routes());
app.use(usuarioRouter.allowedMethods());
app.use(notificacionRouter.routes());
app.use(notificacionRouter.allowedMethods());

app.use(ctx => {
  ctx.response.body = "SAUL API Sever";
});

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(bold("Start listening on ") + yellow(`${hostname}:${port}`));
  console.log(bold("  using HTTP server: " + yellow(serverType)));
});

await app.listen({ hostname: "127.0.0.1", port: 8000 });
console.log(bold("Finished."));
