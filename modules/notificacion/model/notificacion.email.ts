import { SmtpClient } from "../../../deps.ts";
import * as config from "../notificacion.config.ts";
import { updateEstado } from "./notificacion.model.ts";

const client = new SmtpClient();

const smtpConfig = {
  hostname: config.smtp.hostname,
  port: config.smtp.port,
  username: config.smtp.username,
  password: config.smtp.password,
};

export const enviar = async (notificacion: any) => {
  try {
    console.log(
      `Notificación de tipo email creada, enviando mensaje a ${notificacion.email}...`
    );
    let linkConfirmacion = `<a href='${config.urlConfirmacion}/${notificacion._id}'>Haga clic para ver la información</a>`;
    if (notificacion.linkConfirmacion) {
      linkConfirmacion = notificacion.linkConfirmacion;
    }

    const mensaje = `${notificacion.contenido}<p>${linkConfirmacion}</p>`;
    await client.connectTLS(smtpConfig);
    await client.send({
      from: config.smtp.from, // Your Email address
      to: notificacion.email, // Email address of the destination
      subject: notificacion.titulo,
      content: notificacion.contenido,
      html: mensaje,
    });
    await client.close();
    console.log("Email enviado.");
    //Cambiar el estado de la notificación a enviado
    console.log(notificacion._id.valueOf().toString());
    updateEstado(
      notificacion._id.valueOf().toString(),
      config.estados.enviada,
      "Notificación enviada",
      `${Deno.env.get("APP_HOST")}`
    );
  } catch (error) {
    console.error(error);
  }
};
