const { log } = require('console');
const database= require('./js/db.js');
const express = require('express');
const app = express();
const port = 3000; // Elige el puerto que desees usar

// Configurar Express para servir archivos estáticos desde la carpeta 'js'
app.use('/js', express.static(__dirname + '/js'));

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

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor web en ejecución en http://localhost:${port}`);
});
