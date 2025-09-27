import { Router } from "express";
import * as module from "../controllers/controller_post.js";
import multer from "multer";

const router = Router();
const upload = multer();

// Ruta para crear un nuevo post
router.post("/create", upload.single("archivo"), module.crearPost);
router.get("/todos", module.obtenerTodosPosts);
router.get("/usuario/:idUsuario", module.obtenerPostsPorUsuario);
router.post("/reaccion", module.agregarReaccion);
router.post("/quitarReaccion", module.quitarReaccion);  

export default router;
