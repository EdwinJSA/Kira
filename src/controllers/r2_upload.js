import {s3} from "../controllers/r2_conexion.js"; // asumimos que tienes un archivo que exporta la instancia de s3

export const uploadFile = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.R2_BUCKET,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(params).promise();
    res.json({ message: "Archivo subido!", url: result.Location });
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ error: error.message });
  }
};
