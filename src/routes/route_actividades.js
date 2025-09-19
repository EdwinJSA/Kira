import { Router } from "express";
import * as module from "../controllers/controller_actividades.js";

const router = Router();
// RUTAS DE CUESTIONARIOS
router.get("/listaCuestionarios", module.listaCuestionarios);
router.get("/obtenerCuestionario/:idCuestionario", module.obtenerCuestionarios);


// RUTAS DE COPLAS
router.get("/coplas", module.listaCoplas);


// RUTAS DE ADIVINA AL PERSONAJE
router.get("/personajes", module.listaPersonajes);



export default router;