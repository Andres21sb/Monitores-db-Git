const oracledb = require('oracledb');

async function connectToDatabase() {
  try {
    await oracledb.createPool({
      user: 'sys',
      password: 'root',
      connectString: 'localhost:1521/XE', // Reemplaza 'hostname' con la dirección IP de tu máquina host
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
}

async function closeDatabase() {
  try {
    await oracledb.getPool().close();
    console.log('Conexión a la base de datos cerrada');
  } catch (err) {
    console.error('Error al cerrar la conexión a la base de datos:', err);
  }
}

module.exports = {
  connectToDatabase,
  closeDatabase,
  // Otras funciones para realizar operaciones en la base de datos...
};
