import pool from "../../database/supabase.js";

const registrarUsuario = async (req, res) => {
  const { nombre, contrasena, correo, celular, ciudad } = req.body;
  try {
    // validar si el correo ya existe
    const checkQuery = `SELECT * FROM usuarios WHERE correo = $1`;
    const checkResult = await pool.query(checkQuery, [correo]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const query = `
      INSERT INTO usuarios (nombre, contrasena, correo, celular, ciudad)
      VALUES ($1, $2, $3, $4, $5) RETURNING nombre, id`;
    const values = [nombre, contrasena, correo, celular, ciudad];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ error: error.message });
  }
};


const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const query = `
      SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2`;
    const values = [correo, contrasena];
    const result = await pool.query(query, values);
    res.json({ success: true, userId: result.rows[0]?.id || null });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ error: error.message });
  }
};



export { registrarUsuario, loginUsuario };