const oracledb = require('oracledb');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  privilege: oracledb.SYSDBA // o process.env.DB_PRIVILEGE según lo que necesites
};

async function connectToDatabase() {
  try {
    // Crear un pool de conexiones
    await oracledb.createPool(dbConfig);
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err; // Re-lanza el error para que se pueda manejar en el nivel superior
  }
}

async function closeDatabase() {
  try {
    // Cerrar el pool de conexiones
    await oracledb.getPool().close();
    console.log('Conexión a la base de datos cerrada');
  } catch (err) {
    console.error('Error al cerrar la conexión a la base de datos:', err);
    throw err; // Re-lanza el error para que se pueda manejar en el nivel superior
  }
}

async function getSGAUsage() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection();

    // Consulta SQL para obtener información sobre el SGA
    const query = `SELECT name, value /1024/1024 FROM v$sga`;

    // Ejecutar la consulta
    const result = await connection.execute(query);

    // Devolver el resultado de la consulta
    return result.rows;
  } catch (error) {
    console.error('Error al obtener información del SGA:', error);
    throw error; // Re-lanza el error para que se pueda manejar en el nivel superior
  } finally {
    // Cerrar la conexión
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
}

module.exports = {
  connectToDatabase,
  closeDatabase,
  getSGAUsage,
};

