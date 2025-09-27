import { Router } from "express";
import * as module from "../controllers/controller_post.js";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 * 1024 } // limite 300 MB
});


// Ruta para crear un nuevo post
router.post("/create", upload.single("archivo"), module.crearPost);
router.get("/todos", module.obtenerTodosPosts);
router.get("/usuario/:idUsuario", module.obtenerPostsPorUsuario);
router.post("/reaccion", module.agregarReaccion);
router.post("/quitarReaccion", module.quitarReaccion);  

export default router;
