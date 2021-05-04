import { config } from "../../../config/config.ts";
import * as authConfig from "../auth.config.ts";
import { create, getNumericDate } from "../../../deps.ts";
import * as usuarioModel from "../../usuario/model/usuario.model.ts";
import { jwtConfig } from "../../../middlewares/jwt.ts";

interface TokenData {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface UserProfile {
  provider: string;
  providerUserId: string;
  displayName?: string;
  name?: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  emails?: Array<string>;
}

interface AuthData {
  tokenData: TokenData;
  userInfo: UserProfile;
}

export const serializer = async (usuario: any) => {
  console.log("iniciando serializer.....");
  const serializedId = Math.floor(Math.random() * 1000000000);
  try {
    //await exampleDbCreateUpsert(userInfo);
    const nuevoUsuario: any = {
      nombre: usuario.name.familyName,
      apellido: usuario.name.givenName,
      nombreCompleto: usuario.displayName,
      email: usuario.emails[0],
      provider: usuario.provider,
      providerId: usuario.providerUserId,
      serializedId: serializedId,
    };
    const usuarioBD = await usuarioModel.createUpsert(nuevoUsuario);
    console.log(`serializedId: ${serializedId}`);
    console.log("finalizando serializer.....");
    return serializedId;
  } catch (err) {
    console.error(err);
    return err;
    // or return new Error(err);
  }
};

export const deserializer = async (serializedId: number) => {
  try {
    console.log("iniciando deserializer.....");
    console.log(`serializedId: ${serializedId}`);
    const usuario = await usuarioModel.getBySerializedId(serializedId);
    if (!usuario.esValido) {
      console.error(usuario.data);
    }
    console.log(usuario.data);
    console.log("finalizando deserializer.....");
    return usuario.data;
  } catch (err) {
    console.error(err);
    return err;
    // or return new Error(err);
  }
};

export const getGoogleAuthUrl = () => {
  return {
    url: encodeURI(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${authConfig.googleAuth.client_id}&scope=${authConfig.googleAuth.scope}&redirect_uri=${authConfig.googleAuth.redirect_uri}&response_type=${authConfig.googleAuth.response_type}`
    ),
  };
};

export const getGoogleAccessToken = async (code: string) => {
  //Trar token desde google con el accessCode
  /*var post = encodeURI(
    `https://www.googleapis.com/oauth2/v4/token?code=${accessCode}&client_id=${authConfig.googleAuth.client_id}&client_secret=${authConfig.googleAuth.client_secret}&redirect_uri=${authConfig.googleAuth.redirect_uri}&grant_type=authorization_code`
  );
*/

  let post = `client_id=${authConfig.googleAuth.client_id}&redirect_uri=${authConfig.googleAuth.redirect_uri}&client_secret=${authConfig.googleAuth.client_secret}&code=${code}&grant_type=authorization_code`;
  console.log(post);
  let response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: post,
  });
  if (response.status != 200) {
    console.error("Error : Failed to receieve Google access token");
    console.error(response);
    return {
      esValido: false,
      data: { accessToken: "Falla al recibir el Google access token" },
    };
  }
  let jsonResponse = await response.json();
  let accessToken: string = jsonResponse["access_token"];
  return { esValido: true, data: { accessToken: accessToken } };
};

export async function getGoogleProfile(accessToken: string) {
  let response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (response.status != 200) {
    console.error("Error : Failed to get Google user information");
    console.error(response);
    return {
      esValido: false,
      data: { accessToken: "Falla al recibir el Google user profile" },
    };
  }
  let googleUserProfile = await response.json();
  console.log(googleUserProfile);
  if (!googleUserProfile.verified_email) {
    return {
      esValido: false,
      data: {
        userProfile:
          "Falla al recibir el Google user profile, verified_email is false",
      },
    };
  }
  const nuevoUsuario: any = {
    nombre: googleUserProfile.given_name,
    apellido: googleUserProfile.family_name,
    nombreCompleto: googleUserProfile.name,
    email: googleUserProfile.email,
    provider: "Google",
    providerUserId: googleUserProfile.id,
    foto: googleUserProfile.picture,
  };
  const usuarioBD = await usuarioModel.createUpsert(nuevoUsuario);
  if (!usuarioBD.esValido) {
    console.log(usuarioBD.data);
    return { esValido: false, data: usuarioBD.data };
  }
  //Generar el token JWT y asociarlo al usuario
  const jwt = await create(
    { alg: jwtConfig.alg, typ: jwtConfig.type },
    { _id: usuarioBD.data._id, exp: getNumericDate(jwtConfig.expirationTime) },
    config.jwt.secret
  );
  console.log(usuarioBD.data);
  return { esValido: true, data: { jwt: jwt } };
}
