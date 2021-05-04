export const config = {
  app: {
    host: Deno.env.get("APP_HOST"),
    port: Deno.env.get("APP_PORT"),
  },
  api: {
    name: "SAUL",
    version: "1.0",
    status: {
      ok: { code: 200, message: "Solicitud exitosa" }, //Respuesta estándar para peticiones correctas.
      created: { code: 201, message: "Recurso creado exitosamente" }, //La petición ha sido completada y ha resultado en la creación de un nuevo recurso.
      accepted: { code: 202, message: "Solicitud aceptada" }, //La petición ha sido aceptada para procesamiento, pero este no ha sido completado. La petición eventualmente pudiere no ser satisfecha, ya que podría ser no permitida o prohibida cuando el procesamiento tenga lugar.
      badRequest: {
        code: 400,
        message: "La solicitud no es valida, contiene errores",
      }, //El servidor no procesará la solicitud, porque no puede, o no debe, debido a algo que es percibido como un error del cliente (ej: solicitud malformada, sintaxis errónea, etc). La solicitud contiene sintaxis errónea y no debería repetirse.
      authorizationRequired: {
        code: 401,
        message: "Acceso denegado, requiere autenticación",
      }, //Similar al 403 Forbidden, pero específicamente para su uso cuando la autentificación es posible pero ha fallado o aún no ha sido provista. Vea autenticación HTTP básica y Digest access authentication.
      forbidden: {
        code: 403,
        message: "Privilegios insuficientes para realizar esta solicitud",
      }, //La solicitud fue legal, pero el servidor rehúsa responderla dado que el cliente no tiene los privilegios para realizarla. En contraste a una respuesta 401 No autorizado, autenticarse previamente no va a cambiar la respuesta.
      notFound: { code: 404, message: "Recurso no encontrado" }, //Recurso no encontrado. Se utiliza cuando el servidor web no encuentra la página o recurso solicitado.
      InternalServerError: {
        code: 500,
        message: "Algo anda mal, por favor intente de nuevo.",
      }, //Errores internos del servidor
    },
  },
  jwt: {
    secret: Deno.env.get("JWT_SECRET") || "somesecrettoken",
  },
};
