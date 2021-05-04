import { Response, Request, Body } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std@0.94.0/uuid/mod.ts";
import db from "../../../db/mongodb.ts";
import { getAll, addUser } from "../model/usuario.model.ts";

interface User {
  id: string;
  name: string;
}

let users: User[] = [
  {
    id: "1",
    name: "Alejandro Ordoñez",
  },
];

export const getUser = ({
  params,
  response,
}: {
  params: { id: string };
  response: Response;
}) => {
  const userFound = users.find(user => user.id === params.id);
  console.log(userFound);
  if (userFound) {
    response.status = 200;
    response.body = {
      message: "Usuario encontrado",
      userFound,
    };
  } else {
    response.status = 404;
    response.body = {
      message: "Usuario no encontrado",
    };
  }
};

export const getUsers = async ({ response }: { response: Response }) => {
  response.body = {
    message: "Ok",
    users,
    users_bd: getAll, //Traer de la BD
  };
};

export const createUser = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const body: Body = await request.body();
  if (!request.hasBody) {
    response.status = 404;
    response.body = {
      message: "El body es requerido",
    };
  } else {
    const newUser: User = await body.value;
    console.log(newUser);
    newUser.id = v4.generate();
    users.push(newUser);

    //Insertar en la BD
    addUser(newUser.name);
    response.status = 200;
    response.body = {
      message: "Usuario creado",
      newUser,
    };
  }
};

export const updateUser = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: Request;
  response: Response;
}) => {
  const userFound = users.find(user => user.id === params.id);
  console.log(userFound);
  if (!userFound) {
    response.status = 404;
    response.body = {
      message: "Usuario no encontrado",
    };
  } else {
    const body = await request.body();
    const updatedUser = await body.value;

    users = users.map(user =>
      user.id === params.id ? { ...user, ...updatedUser } : user
    );

    response.status = 200;
    response.body = {
      message: "Usuario Actualizado",
      users,
    };
  }
};
