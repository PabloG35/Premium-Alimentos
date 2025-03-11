// cloudinary.js
import { v2 as cloudinary } from "cloudinary";

if (process.env.NODE_ENV !== "production") {
  // Solo en desarrollo, carga las variables del .env
  import("dotenv").then((dotenv) => dotenv.config());
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Faltan las variables de entorno de Cloudinary");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
