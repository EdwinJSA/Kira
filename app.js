import express from "express";
import multer from "multer";
import { uploadFile } from "./src/controllers/r2_upload.js";
import routesUsers from "./src/routes/route_users.js";
import routerActividades from "./src/routes/route_actividades.js";
import routerPost from "./src/routes/route_post.js";
import * as middleware from "./src/middleware/auth.js";
import cors from "cors";

// configura el path
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Inicializar Express y Multer
const app = express();

app.use(cors({
  origin: 'https://kira-pink-theta.vercel.app',
  credentials: true // si vas a enviar cookies o headers de auth
}));

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Validar que el usuario esté autenticado
app.use(middleware.validarUsuario);

// Ruta para subir archivos a R2
app.post("/upload", upload.single("file"), uploadFile);

// Rutas de la API
app.use("/users", routesUsers);
app.use("/actividades", routerActividades);
app.use("/posts", routerPost); 

// Servir index.html desde src/templates
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "templates", "index.html"));
});


// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000, http://localhost:3000");
});

