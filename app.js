const express = require('express');
const app = express();

// Definir puerto
const PORT = 3000;

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Hola, Express está funcionando! 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
