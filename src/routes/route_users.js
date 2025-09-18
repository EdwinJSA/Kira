import { Router } from "express";
import * as module from "../controllers/controller_users.js";


const router = Router();

// Ruta de registro de usuario
router.post("/register", module.registrarUsuario);

export default router;
