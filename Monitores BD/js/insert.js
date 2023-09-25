const oracledb = require("oracledb");
require("dotenv").config(); // Carga las variables de entorno desde .env

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: "system",
  password: "root",
  connectString: "localhost:1521/FREE",
  privilege: oracledb.SYSDBA, // o process.env.DB_PRIVILEGE según lo que necesites
};

async function connectToDatabase() {
  try {
    // Crear un pool de conexiones
    await oracledb.createPool(dbConfig);
    console.log("Conexión a la base de datos exitosa");
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err);
    throw err; // Re-lanza el error para que se pueda manejar en el nivel superior
  }
}

async function createTablesAndInsertData() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection();

    // Crear 100 tablas nuevas (cambiar el nombre de la tabla y la estructura según tus necesidades)
    for (let i = 1; i <= 100; i++) {
      const tableName = `TABLE_${'k'.repeat(i)}`;
      const createTableSQL = `
          CREATE TABLE ${tableName} (
            ID NUMBER PRIMARY KEY,
            NAME VARCHAR2(50)
          ) tablespace TBS3
        `;

      // Ejecutar la consulta DDL para crear la tabla
      await connection.execute(createTableSQL);
      console.log(`Tabla ${tableName} creada.`);

      // Insertar 5,000 registros en la tabla
      const insertSQL = `
        INSERT INTO ${tableName} (ID, NAME)
        SELECT ROWNUM, 'Name_' || ROWNUM FROM DUAL CONNECT BY ROWNUM <= 5000
      `;
      await connection.execute(insertSQL);
      console.log(`5000 registros insertados en ${tableName}`);
    }
  } catch (error) {
    console.error("Error al crear tablas o insertar registros:", error);
    throw error; // Re-lanza el error para que se pueda manejar en el nivel superior
  } finally {
    // Cerrar la conexión
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error al cerrar la conexión:", error);
      }
    }
  }
}

async function main() {
  await connectToDatabase();

  await createTablesAndInsertData();
}

main().catch((error) => {
  console.error("Error en el script:", error);
});
