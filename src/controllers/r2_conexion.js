// import AWS from "aws-sdk";
// import dotenv from "dotenv";

// // 👇 Obtenemos __dirname en ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 👇 Cargamos .env desde la raíz del proyecto
// dotenv.config({
//   path: path.resolve(__dirname, "../../.env"), // subimos 2 niveles desde src/config/
// });

// console.log("Cargando variables de entorno desde:", path.resolve(__dirname, "../../.env"));
// console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID ? "✅" : "❌");


// // Configurar S3 (Cloudflare R2)
// const s3 = new AWS.S3({
//   endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   accessKeyId: process.env.R2_ACCESS_KEY_ID,
//   secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//   signatureVersion: "v4",
// });

// export {s3};


import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 📌 Obtenemos __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Cargamos .env desde la raíz del proyecto
dotenv.config({
  path: path.resolve(__dirname, "../../.env"), // subimos 2 niveles desde src/config/
});

console.log("Cargando variables de entorno desde:", path.resolve(__dirname, "../../.env"));
console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID ? "✅" : "❌");

// 📌 Configurar S3 (Cloudflare R2)
const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto", // opcional para Cloudflare
});

export {s3};

