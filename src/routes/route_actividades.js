import { Router } from "express";
import * as module from "../controllers/controller_actividades.js";

const router = Router();
// RUTAS DE CUESTIONARIOS
router.get("/listaCuestionarios", module.listaCuestionarios);
router.get("/obtenerCuestionario/:idCuestionario", module.obtenerCuestionarios);
router.post("/sumarPuntajeCuestionario", module.sumarPuntajeCuestionario);


// RUTAS DE COPLAS
router.get("/coplas", module.listaCoplas);
router.post("/sumarPuntajeCopla", module.sumarPuntajeCopla);


// RUTAS DE ADIVINA AL PERSONAJE
router.get("/personajes", module.listaPersonajes);
router.post("/sumarPuntajePersonaje", module.sumarPuntajePersonaje);



export default router;