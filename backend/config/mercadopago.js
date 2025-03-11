import dotenv from "dotenv";
dotenv.config();

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("Falta la variable de entorno MP_ACCESS_TOKEN");
}

import mp from "mercadopago";
const mercadopago = mp.default || mp;

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default mercadopago;
