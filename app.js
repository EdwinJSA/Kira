import express from "express";
import multer from "multer";
import { uploadFile } from "./src/controllers/r2_upload.js";
import routesUsers from "./src/routes/route_users.js";
import * as middleware from "./src/middlewares/middleware.js";


// Inicializar Express y Multer
const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Validar que el usuario esté autenticado
app.use(middleware.validarUsuario);

// Ruta para subir archivos a R2
app.post("/upload", upload.single("file"), uploadFile);

// Rutas de la API
app.use("/users", routesUsers);

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000, http://localhost:3000");
});

