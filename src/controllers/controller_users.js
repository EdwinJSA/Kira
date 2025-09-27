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


const obtenerPuntajeUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT puntaje FROM usuarios WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ puntaje: result.rows[0].puntaje });
  } catch (error) {
    console.error("❌ Error al obtener puntaje de usuario:", error);
    res.status(500).json({ error: error.message });
  }
};


const puntajeTodos = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        nombre, 
        puntaje,
        ROW_NUMBER() OVER (ORDER BY puntaje DESC) AS posicion
      FROM usuarios
      ORDER BY puntaje DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener puntajes de todos los usuarios:", error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerNombreUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT nombre FROM usuarios WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ nombre: result.rows[0].nombre });
  } catch (error) {
    console.error("❌ Error al obtener nombre de usuario:", error);
    res.status(500).json({ error: error.message });
  }
};



export { registrarUsuario, loginUsuario, obtenerPuntajeUsuario, puntajeTodos, obtenerNombreUsuario };