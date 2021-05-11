import { Router } from "../../../deps.ts";
//import * as tipoSolicitudController from "../controller/tipoSolicitud.controller.ts";
//import { jwtAuth } from "../../../middlewares/jwt.ts";

const tipoSolicitudRouter = new Router();

tipoSolicitudRouter.get("/v1/tipo-solicitud", ctx => {
  ctx.response.body = {
    _id: "608bbb4109970757e45fcee3",
    nombre: "Radicación de la solicitud",
    tipoSolicitud_id: 1,
    estado_id: 1,
    permiso_id: 2,
    atributos: [
      {
        id: 1,
        nombre: "duracion",
        titulo: "Duración",
        inputType: "text",
        initialValue: "",
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: false,
        },
      },
      {
        id: 2,
        nombre: "direccion",
        titulo: "Dirección",
        inputType: "text",
        initialValue: "",
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: false,
        },
      },
      {
        id: 3,
        nombre: "tipoValla",
        titulo: "Tipo de valla",
        inputType: "select",
        initialValue: "Culata",
        options: [
          { value: 1, label: "Doble" },
          { value: 2, label: "Culata" },
          { value: 3, label: "Electrónica" },
        ],
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: false,
        },
      },
      {
        id: 4,
        nombre: "terminos",
        titulo: "Estoy de acuerdo con los términos y condiciones",
        inputType: "check",
        initialValue: "",
        validationSchema: {
          type: "boolean",
          required: { is: true },
          oneOf: { ref: true, message: "Los terminos deben ser aceptados" },
        },
      },
      {
        id: 5,
        nombre: "poliza",
        titulo: "Poliza de responsabilidad civil",
        inputType: "file",
        initialValue: "",
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: false,
        },
      },
      {
        id: 6,
        nombre: "password",
        titulo: "Password",
        inputType: "password",
        initialValue: "",
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: {
            ref: "repeatPassword",
            message: "Contraseñas deben ser iguales",
          },
        },
      },
      {
        id: 7,
        nombre: "repeatPassword",
        titulo: "Repetir Password",
        inputType: "password",
        initialValue: "",
        validationSchema: {
          type: "string",
          required: { is: true, message: "Campo requerido" },
          oneOf: { ref: "password", message: "Contraseñas deben ser iguales" },
        },
      },
    ],
  };
});

/*
router.get("/book/:id/page/:page", ctx => {
  getQuery(ctx, { mergeParams: true });
});
*/
export default tipoSolicitudRouter;
