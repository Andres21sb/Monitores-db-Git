const oracledb = require('oracledb');

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: 'sys',
  password: 'root',
  connectString: 'localhost:1521/FREE',
  privilege: oracledb.SYSDBA // Especifica el privilegio como SYSDBA
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
    const query = `
      SELECT name, value FROM v$sga;
    `;

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

