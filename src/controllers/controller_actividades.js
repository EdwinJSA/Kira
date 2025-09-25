import pool from "../../database/supabase.js";

// CUESTIONARIOS
const listaCuestionarios = async (req, res) => {
    try {
        const query = "SELECT id, titulo FROM cuestionario";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener cuestionarios:", error);
        res.status(500).json({ error: error.message });
    }
};

const obtenerCuestionarios = async (req, res) => {
    const { idCuestionario } = req.params;
    try {
        const query = `
        SELECT json_build_object(
            'id', c.id,
            'titulo', c.titulo,
            'descripcion', c.descripcion,
            'tipo', c.tipo,
            'puntaje', c.puntaje,
            'preguntas', COALESCE(
                json_agg(
                    json_build_object(
                        'id', p.id,
                        'pregunta', p.pregunta,
                        'respuestas', (
                            SELECT COALESCE(
                                json_agg(
                                    json_build_object(
                                        'id', r.id,
                                        'respuesta', r.respuesta,
                                        'es_correcta', r.es_correcta
                                    )
                                ), '[]'::json
                            )
                            FROM cuest_respuesta r
                            WHERE r."idPregunta" = p.id
                        )
                    )
                ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
            )
        ) AS cuestionario
        FROM cuestionario c
        LEFT JOIN cuest_preguntas p ON p."idCuestionario" = c.id
        WHERE c.id = $1
        GROUP BY c.id;
        `;
        const values = [idCuestionario];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener cuestionarios:", error);
        res.status(500).json({ error: error.message });
    }
};


const sumarPuntajeCuestionario = async (req, res) => {
    const { idCuestionario, idUsuario, cant_correcta } = req.body;
    try {
        // 1. Verificar si ya completó ese cuestionario
        const verificarQuery = 'SELECT * FROM "cuestionarioPorUsuario" WHERE "idUsuario" = $1 AND "idCuestionario" = $2';
        const verificarValues = [idUsuario, idCuestionario];
        const verificarResult = await pool.query(verificarQuery, verificarValues);

        if (verificarResult.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya ha completado este cuestionario.' });
        }

        // 2. Obtener el puntaje del cuestionario
        const puntajeQuery = 'SELECT puntaje FROM cuestionario WHERE id = $1';
        const puntajeValues = [idCuestionario];
        const puntajeResult = await pool.query(puntajeQuery, puntajeValues);

        if (puntajeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cuestionario no encontrado.' });
        }

        const puntajePorCuestionario = puntajeResult.rows[0].puntaje;

        // 3. Calcular el puntaje a sumar
        const puntajeASumar = (cant_correcta / 10) * puntajePorCuestionario;

        // 4. Sumar puntaje al usuario
        const sumarQuery = 'UPDATE "usuarios" SET "puntaje" = "puntaje" + $1 WHERE "id" = $2';
        const sumarValues = [puntajeASumar, idUsuario];
        await pool.query(sumarQuery, sumarValues);

        // 5. Registrar que completó el cuestionario
        const registrarQuery = 'INSERT INTO "cuestionarioPorUsuario" ("idUsuario", "idCuestionario", "cant_correcta") VALUES ($1, $2, $3)';
        const registrarValues = [idUsuario, idCuestionario, cant_correcta];
        await pool.query(registrarQuery, registrarValues);

        res.status(200).json({ message: 'Puntaje sumado correctamente.' });
    } catch (error) {
        console.error('❌ Error al sumar puntaje:', error);
        res.status(500).json({ error: error.message });
    }
}

// ADIVINA AL PERSONAJE
const listaPersonajes = async (req, res) => {
    try {
        const query = "SELECT * FROM personajes";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener personajes:", error);
        res.status(500).json({ error: error.message });
    }
};

const sumarPuntajePersonaje = async (req, res) => {
    const { idPersonaje, idUsuario } = req.body;
    try {
        // 1. Verificar si ya completó ese personaje
        const verificarQuery = 'SELECT * FROM "personajePorUsuario" WHERE "idUsuario" = $1 AND "idPersonaje" = $2';
        const verificarValues = [idUsuario, idPersonaje];
        const verificarResult = await pool.query(verificarQuery, verificarValues);

        if (verificarResult.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya ha completado este personaje.' });
        }

        // Obtener el puntaje del personaje
        const puntajeQuery = 'SELECT puntaje FROM personajes WHERE id = $1';
        const puntajeValues = [idPersonaje];
        const puntajeResult = await pool.query(puntajeQuery, puntajeValues);
        if (puntajeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Personaje no encontrado.' });
        }
        const puntajePorPersonaje = puntajeResult.rows[0].puntaje;

        // 2. Sumar puntaje al usuario
        const sumarQuery = 'UPDATE "usuarios" SET "puntaje" = "puntaje" + $1 WHERE "id" = $2';
        const sumarValues = [puntajePorPersonaje, idUsuario];
        await pool.query(sumarQuery, sumarValues);
        // 3. Registrar que completó el personaje
        const registrarQuery = 'INSERT INTO "personajePorUsuario" ("idUsuario", "idPersonaje", "completado", "puntaje") VALUES ($1, $2, $3, $4)';
        const registrarValues = [idUsuario, idPersonaje, true, puntajePorPersonaje];
        await pool.query(registrarQuery, registrarValues);
        res.status(200).json({ message: 'Puntaje sumado correctamente.' });
    } catch (error) {
        console.error('❌ Error al sumar puntaje:', error);
        res.status(500).json({ error: error.message });
    }
}

// COPLAS
const listaCoplas = async (req, res) => {
    try {
        const query = `
            SELECT json_agg(
                json_build_object(
                    'id', c.id,
                    'link_video', c.link_video,
                    'preguntas', COALESCE(
                        (
                            SELECT json_agg(
                                json_build_object(
                                    'id', p.id,
                                    'pregunta', p.pregunta,
                                    'respuestas', COALESCE(
                                        (
                                            SELECT json_agg(
                                                json_build_object(
                                                    'id', r.id,
                                                    'texto_respuesta', r.texto_respuesta,
                                                    'es_correcta', r.es_correcta
                                                )
                                            )
                                            FROM copla_respuestas r
                                            WHERE r."idPregunta" = p.id
                                        ), '[]'::json
                                    )
                                )
                            )
                            FROM copla_preguntas p
                            WHERE p."idCopla" = c.id
                        ), '[]'::json
                    )
                )
            ) AS coplas
            FROM copla c;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener coplas:", error);
        res.status(500).json({ error: error.message });
    }
};


const sumarPuntajeCopla = async (req, res) => {
    const puntajePorCopla = 50;
    const { idCopla, idUsuario } = req.body;

    try {
        // 1. Verificar si ya completó esa copla
        const verificarQuery = 'SELECT * FROM "coplaPorUsuario" WHERE "idUsuario" = $1 AND "idCopla" = $2';
        const verificarValues = [idUsuario, idCopla];
        const verificarResult = await pool.query(verificarQuery, verificarValues);

        if (verificarResult.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya ha completado esta copla.' });
        }

        // 2. Sumar puntaje al usuario
        const sumarQuery = 'UPDATE "usuarios" SET "puntaje" = "puntaje" + $1 WHERE "id" = $2';
        const sumarValues = [puntajePorCopla, idUsuario];
        await pool.query(sumarQuery, sumarValues);

        // 3. Registrar que completó la copla
        const registrarQuery = 'INSERT INTO "coplaPorUsuario" ("idUsuario", "idCopla", "completado", "puntaje") VALUES ($1, $2, $3, $4)';
        const registrarValues = [idUsuario, idCopla, true, puntajePorCopla];
        await pool.query(registrarQuery, registrarValues);

        res.status(200).json({ message: 'Puntaje sumado correctamente.' });
    } catch (error) {
        console.error('❌ Error al sumar puntaje:', error);
        res.status(500).json({ error: error.message });
    }
};




export { obtenerCuestionarios, listaCuestionarios, listaPersonajes, listaCoplas, sumarPuntajeCopla, sumarPuntajeCuestionario, sumarPuntajePersonaje };