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




export { obtenerCuestionarios, listaCuestionarios, listaPersonajes, listaCoplas };