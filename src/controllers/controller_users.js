import pool from "../../database/supabase.js";

const registrarUsuario = async (req, res) => {
  const { nombre, contrasena, correo, celular, ciudad } = req.body;
    try {
    const query = `
      INSERT INTO usuarios (nombre, contrasena, correo, celular, ciudad)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [nombre, contrasena, correo, celular, ciudad];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ error: error.message });
  }
};


export {registrarUsuario};