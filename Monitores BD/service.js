const { log } = require('console');
const database= require('./js/db.js');
const express = require('express');
const app = express();
const port = 3000; // Elige el puerto que desees usar

// Configurar Express para servir archivos estáticos desde la carpeta 'js'
app.use('/js', express.static(__dirname + '/js'));
app.use(express.static('public'));

// Ruta para servir tu archivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicializa la conexión a la base de datos cuando el servidor se inicia
database.connectToDatabase();

// Cierra la conexión a la base de datos cuando el servidor se detiene
process.on('SIGINT', () => {
  database.closeDatabase().then(() => {
    console.log('Servidor detenido y conexión a la base de datos cerrada');
    process.exit();
  });
});

app.get('/sga', async (req, res) => {
  try {
    const sgaUsage = await database.getSGAUsage();
    res.json(sgaUsage);
  } catch (error) {
    console.error('Error al obtener información del SGA:', error);
    res.status(500).json({ error: 'Error al obtener información del SGA' });
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor web en ejecución en http://localhost:${port}`);
});
