import { s3 } from "../controllers/r2_conexion.js"; 
import sharp from "sharp";

export const optimizeImage = async (buffer) => {
  try {
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200 })        
      .webp({ quality: 75 })         
      .toBuffer();

    return optimizedBuffer;
  } catch (error) {
    console.error("❌ Error al optimizar imagen:", error);
    throw new Error("Error al optimizar la imagen");
  }
};

export const uploadFile = async (file) => {
  try {
    const optimizedImage = await optimizeImage(file.buffer);

    const fileName = file.originalname.replace(/\.[^/.]+$/, ".webp");

    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: optimizedImage,
      ContentType: "image/webp",
    };

    const result = await s3.upload(params).promise();
    const publicBaseUrl = process.env.R2_PUBLIC_URL; 
    const publicUrl = `${publicBaseUrl}/${fileName}`;

    return publicUrl; // 👈 devolvemos la URL
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    throw new Error("Error al subir archivo");
  }
};


export const uploadVideo = async (file) => {
  try {
    const fileName = file.originalname;

    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();
    const publicBaseUrl = process.env.R2_PUBLIC_URL;
    const publicUrl = `${publicBaseUrl}/${fileName}`;

    return publicUrl;
  } catch (error) {
    console.error("❌ Error al subir video:", error);
    throw new Error("Error al subir video");
  }
};
