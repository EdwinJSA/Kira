import AWS from "aws-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("Cargando variables de entorno desde:", path.resolve(__dirname, "../../.env"));
console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID ? "✅" : "❌");

const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto", 
});

export {s3};

