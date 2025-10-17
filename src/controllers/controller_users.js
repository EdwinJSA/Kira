import pool from "../../database/supabase.js";
import bcrypt from 'bcrypt';
import * as math from 'mathjs';

const registrarUsuario = async (req, res) => {
  const { nombre, contrasena, correo, celular, ciudad } = req.body;
  try {
    
    const checkQuery = `SELECT * FROM usuarios WHERE correo = $1`;
    const checkResult = await pool.query(checkQuery, [correo]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }


    const saltRounds = math.randomInt(10, 15); 
    const contraEcripta = await bcrypt.hash(contrasena, saltRounds)

    const query = `
    INSERT INTO usuarios (nombre, contrasena, correo, celular, ciudad, hash)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING nombre, id`;

    const values = [nombre, contraEcripta, correo, celular, ciudad, saltRounds];
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
    const query = `SELECT id, nombre, contrasena FROM usuarios WHERE correo = $1`;
    const values = [correo];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const user = result.rows[0];

    const contrasenaValida = await bcrypt.compare(contrasena, user.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    res.json({
      success: true,
      userId: user.id,
      nombre: user.nombre
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ error: error.message });
  }
};




// const loginUsuario = async (req, res) => {
//   const { correo, contrasena } = req.body;
//   try {
//     const query = `
//       SELECT * FROM contrasena, hash WHERE correo = $1`;
//     const values = [correo];

//     //validar que la contraseña hasheada coincida con la de la base de datos
//     const result = await pool.query(query, values);
//     hashRounds = result.rows[0]?.hash;
//     const contrasenaValida = await bcrypt.compare(contrasena, result.rows[0]?.contrasena);

//     if (result.rows.length === 0 || !contrasenaValida) {
//       return res.status(401).json({ error: "Correo o contrasena incorrectos" });
//     }

//     res.json({ success: true, userId: result.rows[0]?.id || null });
//   } catch (error) {
//     console.error("❌ Error al iniciar sesión:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


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

const cambiarContrasena = async (req, res) => {
  const { id, contrasenaActual, nuevaContrasena } = req.body;
  try {
    // Verificar la contrasena actual
    const checkQuery = `SELECT contrasena FROM usuarios WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const contrasenaEncontrada = checkResult.rows[0].contrasena;
    if (contrasenaEncontrada !== contrasenaActual) {
      return res.status(400).json({ error: "Contrasena actual incorrecta" });
    }

    // Actualizar la contrasena
    const updateQuery = `UPDATE usuarios SET contrasena = $1 WHERE id = $2 RETURNING *`;
    const values = [nuevaContrasena, id];
    const result = await pool.query(updateQuery, values);
    res.json({ success: true, Message: "Contrasena cambiada con exito" });
  } catch (error) {
    console.error("❌ Error al cambiar contrasena:", error);
    res.status(500).json({ error: error.message });
  }
};

const cambiarNombreUsuario = async (req, res) => {
  const { id, nuevoNombre } = req.body;
  try {
    const updateQuery = `UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *`;
    const values = [nuevoNombre, id];
    const result = await pool.query(updateQuery, values);
    res.json({ success: true, Message: "Nombre de usuario cambiado con exito" });
  } catch (error) {
    console.error("❌ Error al cambiar nombre de usuario:", error);
    res.status(500).json({ error: error.message });
  }
};


export { registrarUsuario, loginUsuario, obtenerPuntajeUsuario, puntajeTodos, obtenerNombreUsuario, cambiarContrasena, cambiarNombreUsuario };