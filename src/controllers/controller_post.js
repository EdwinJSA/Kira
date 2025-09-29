import pool from "../../database/supabase.js";
import * as module from "./r2_upload.js";


// crear un nuevo post
// crear un nuevo post
const crearPost = async (req, res) => {
  const { descripcion, categoria, idUsuario } = req.body;

  try {
    let linkArchivo;

    // Detectar tipo de archivo
    if (req.file.mimetype.startsWith("image/")) {
      // 👇 si es imagen
      linkArchivo = await module.uploadFile(req.file);
    } else if (req.file.mimetype.startsWith("video/")) {
      // 👇 si es video
      linkArchivo = await module.uploadVideo(req.file);
    } else {
      return res.status(400).json({ error: "Formato de archivo no soportado" });
    }

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
    try {
        const query = `
            SELECT 
                p.*, 
                u.nombre AS usuario,
                -- cantidad de reacciones
                (SELECT COUNT(*) 
                 FROM reacciones r 
                 WHERE r."idPost" = p.id
                ) AS reacciones,
                -- nombres de usuarios que reaccionaron
                (SELECT COALESCE(
                        json_agg(u2.nombre), '[]'::json
                    )
                 FROM reacciones r
                 JOIN usuarios u2 ON r."idUsuario" = u2.id
                 WHERE r."idPost" = p.id
                ) AS usuarios_que_reaccionaron,
                -- comentarios con autor, texto y fecha, ordenados por fecha descendente
                (SELECT COALESCE(
                        json_agg(
                            json_build_object(
                                'id', c.id,
                                'idUsuario', c."idUsuario",
                                'texto', c.texto,
                                'fecha_creacion', c.fecha_creacion,
                                'autor', u2.nombre
                            )
                            ORDER BY c.fecha_creacion DESC
                        ), '[]'::json
                    )
                 FROM comentarios c
                 JOIN usuarios u2 ON c."idUsuario" = u2.id
                 WHERE c."idPost" = p.id
                ) AS comentarios
            FROM post p
            JOIN usuarios u ON p."idUsuario" = u.id
            ORDER BY p."fecha_creación"  DESC
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error al obtener todos los posts:", error);
        res.status(500).json({ error: error.message });
    }
};

const obtenerPostPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const query = `
            SELECT 
                p.*, 
                u.nombre AS usuario,
                -- cantidad de reacciones
                (SELECT COUNT(*) 
                 FROM reacciones r 
                 WHERE r."idPost" = p.id
                ) AS cantidad_reacciones,
                -- lista de usuarios que reaccionaron
                (SELECT COALESCE(
                        json_agg(json_build_object(
                            'idUsuario', u2.id,
                            'nombre', u2.nombre
                        )), '[]'::json
                    )
                 FROM reacciones r
                 JOIN usuarios u2 ON r."idUsuario" = u2.id
                 WHERE r."idPost" = p.id
                ) AS usuarios_que_reaccionaron,
                -- comentarios con autor, texto y fecha, ordenados por fecha descendente
                (SELECT COALESCE(
                        json_agg(
                            json_build_object(
                                'id', c.id,
                                'idUsuario', c."idUsuario",
                                'texto', c.texto,
                                'fecha_creacion', c.fecha_creacion,
                                'autor', u2.nombre
                            )
                            ORDER BY c.fecha_creacion DESC
                        ), '[]'::json
                    )
                 FROM comentarios c
                 JOIN usuarios u2 ON c."idUsuario" = u2.id
                 WHERE c."idPost" = p.id
                ) AS comentarios
            FROM post p
            LEFT JOIN usuarios u ON p."idUsuario" = u.id
            WHERE p.id = $1
            LIMIT 1
        `;

        const result = await pool.query(query, [Number(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Post no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al obtener el post:", error);
        res.status(500).json({ error: error.message });
    }
};




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

        // validar si la reaccion ya existe
        const checkQuery = `SELECT * FROM "reacciones" WHERE "idPost" = $1 AND "idUsuario" = $2`;
        const checkResult = await pool.query(checkQuery, [idPost, idUsuario]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'La reacción ya existe' });
        }

        const query = `
            INSERT INTO "reacciones" ("idPost", "idUsuario", "fecha")
            VALUES ($1, $2, NOW()) RETURNING *`;
        const values = [idPost, idUsuario];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al agregar reaccion:", error);
        res.status(500).json({ error: error.message });
    }
}

const quitarReaccion = async (req, res) => {
    const { idPost, idUsuario } = req.body;
    try {
        // validar si la reaccion existe
        const checkQuery = `SELECT * FROM "reacciones" WHERE "idPost" = $1 AND "idUsuario" = $2`;
        const checkResult = await pool.query(checkQuery, [idPost, idUsuario]);
        if (checkResult.rows.length === 0) {
            return res.status(400).json({ error: 'La reacción no existe' });
        }
        const query = `DELETE FROM "reacciones" WHERE "idPost" = $1 AND "idUsuario" = $2 RETURNING *`;
        const values = [idPost, idUsuario];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al quitar reaccion:", error);
        res.status(500).json({ error: error.message });
    }
}

const agregarComentario = async (req, res) => {
    const { idPost, idUsuario, texto } = req.body;
    try {
        const query = `
            INSERT INTO comentarios ("idPost", "idUsuario", texto, "fecha_creacion")
            VALUES ($1, $2, $3, NOW()) RETURNING *`;
        const values = [idPost, idUsuario, texto];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error al agregar comentario:", error);    
        res.status(500).json({ error: error.message });
    }
}


const quitarComentario = async (req, res) => {
    const { idComentario, idUsuario } = req.body;
    try {
        // validar si el comentario existe y pertenece al usuario
        const checkQuery = `SELECT * FROM comentarios WHERE id = $1 AND "idUsuario" = $2`;
        const checkResult = await pool.query(checkQuery, [idComentario, idUsuario]);
        if (checkResult.rows.length === 0) {
            return res.status(400).json({ error: 'El comentario no existe o no pertenece al usuario' });
        }   
        const query = `DELETE FROM comentarios WHERE id = $1`;
        const values = [idComentario];
        const result = await pool.query(query, values);
        res.json({message: 'Comentario eliminado', success: true});
    }
    catch (error) {
        console.error("❌ Error al quitar comentario:", error);
        res.status(500).json({ error: error.message });
    }
}

const eliminarPost = async (req, res) => {
    const { idPost, idUsuario } = req.body;
    try {
        // validar si el post existe y pertenece al usuario
        const checkQuery = `SELECT * FROM post WHERE id = $1 AND "idUsuario" = $2`;
        const checkResult = await pool.query(checkQuery, [idPost, idUsuario]);
        if (checkResult.rows.length === 0) {
            return res.status(400).json({ error: 'El post no existe o no pertenece al usuario' });
        }

        // eliminar dependencias
        await pool.query(`DELETE FROM reacciones WHERE "idPost" = $1`, [idPost]);
        await pool.query(`DELETE FROM comentarios WHERE "idPost" = $1`, [idPost]);

        // eliminar el post
        const query = `DELETE FROM post WHERE id = $1`;
        const result = await pool.query(query, [idPost]);

        res.json({ message: 'Post eliminado', success: true });
    } catch (error) {
        console.error("❌ Error al eliminar post:", error);
        res.status(500).json({ error: error.message });
    }
}


const verificarLikeUsuario = async (req, res) => {
    const { idPost, idUsuario } = req.query;
    try {
        const query = `SELECT 1 FROM "reacciones" WHERE "idPost" = $1 AND "idUsuario" = $2 LIMIT 1`;
        const values = [idPost, idUsuario];
        const result = await pool.query(query, values);

        // devolver json al cliente
        res.json({ liked: result.rows.length > 0 });
    } catch (error) {
        console.error("❌ Error al verificar like del usuario:", error);
        res.status(500).json({ error: error.message });
    }
};



export {
    crearPost,
    obtenerTodosPosts,
    obtenerPostsPorUsuario,
    agregarReaccion,
    quitarReaccion,
    agregarComentario,
    quitarComentario,
    eliminarPost,
    obtenerPostPorId,
    verificarLikeUsuario
}