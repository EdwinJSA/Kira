import pool from "../../database/supabase.js";
import { uploadFile } from "./r2_upload.js";


// crear un nuevo post
const crearPost = async (req, res) => {
    const { descripcion, categoria, idUsuario } = req.body;

    try {
        const linkArchivo = await uploadFile(req.file);

        const query = `
            INSERT INTO post ("idUsuario", descripcion, link_archivo, tipo, fecha_creación)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
        const values = [idUsuario, descripcion, linkArchivo, categoria];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al crear post:", error);
        res.status(500).json({ error: error.message });
    }
};



const obtenerTodosPosts = async (_req, res) => {
    // este recupera todos los posts con el nombre de su autor, todos los comentarios de cada post y cantidad de reacciones de cada uno
    try {
        const query = `
            SELECT p.*, u.nombre AS usuario,
            (SELECT COUNT(*) FROM reacciones r WHERE r."idPost" = p.id) AS reacciones,
            (SELECT json_agg(json_build_object('id', c.id, 'idUsuario', c."idUsuario", 'texto', c.texto, 'fecha_creacion', c.fecha_creacion, 'autor', u2.nombre))
             FROM comentarios c
             JOIN usuarios u2 ON c."idUsuario" = u2.id
             WHERE c."idPost" = p.id) AS comentarios
            FROM post p
            JOIN usuarios u ON p."idUsuario" = u.id
            ORDER BY p."fecha_creación" DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener todos los posts:", error);
        res.status(500).json({ error: error.message });
    }
}


const obtenerPostsPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const query = `SELECT * FROM post WHERE "idUsuario" = $1 ORDER BY "fecha_creación" DESC`;
        const values = [idUsuario];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener posts por usuario:", error);
        res.status(500).json({ error: error.message });
    }
}


const agregarReaccion = async (req, res) => {
    const { idPost, idUsuario } = req.body;
    try {
        const query = `
            INSERT INTO reacciones (idPost, idUsuario, fecha)
            VALUES ($1, $2, NOW()) RETURNING *`;
        const values = [idPost, idUsuario];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al agregar reaccion:", error);
        res.status(500).json({ error: error.message });
    }
}



export { crearPost, obtenerTodosPosts, obtenerPostsPorUsuario, agregarReaccion };