import { Router } from "express";
import * as module from "../controllers/controller_users.js";


const router = Router();

// Ruta de registro de usuario
router.post("/register", module.registrarUsuario);
router.post("/login", module.loginUsuario);
router.get("/puntajeUsuario/:id", module.obtenerPuntajeUsuario);
router.get("/puntajeTodos", module.puntajeTodos);
router.get("/nombreUsuario/:id", module.obtenerNombreUsuario);
router.post("/cambiarContrasena", module.cambiarContrasena);
router.post("/cambiarNombreUsuario", module.cambiarNombreUsuario);

export default router;
