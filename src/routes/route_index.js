import { Router } from "express";
import usuarioRoutes from "./route_users.js";

const router = Router();

// Agrupamos todas las rutas de usuario bajo /users
router.post("/users", usuarioRoutes);

export default router;
