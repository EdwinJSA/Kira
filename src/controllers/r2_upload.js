import { s3 } from "../controllers/r2_conexion.js"; 
import sharp from "sharp";

// 🔹 Función para optimizar la imagen y convertir a WebP
export const optimizeImage = async (buffer) => {
  try {
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200 })        // opcional: redimensionar ancho máx
      .webp({ quality: 75 })          // convertir a WebP con calidad 75%
      .toBuffer();

    return optimizedBuffer;
  } catch (error) {
    console.error("❌ Error al optimizar imagen:", error);
    throw new Error("Error al optimizar la imagen");
  }
};

export const uploadFile = async (req, res) => {
  try {
    // Llamamos a la función para optimizar
    const optimizedImage = await optimizeImage(req.file.buffer);

    // Convertir el nombre a .webp
    const fileName = req.file.originalname.replace(/\.[^/.]+$/, ".webp");

    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: optimizedImage,
      ContentType: "image/webp",
    };

    const result = await s3.upload(params).promise();
    const publicBaseUrl = process.env.R2_PUBLIC_URL; 
    const publicUrl = `${publicBaseUrl}/${fileName}`;

    res.json({ 
      message: "Archivo subido!", 
      url: publicUrl,          // 👈 URL pública
    });
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ error: error.message });
  }
};