const oracledb = require("oracledb");
require("dotenv").config(); // Carga las variables de entorno desde .env

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
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

async function closeDatabase() {
  try {
    // Cerrar el pool de conexiones
    await oracledb.getPool().close();
    console.log("Conexión a la base de datos cerrada");
  } catch (err) {
    console.error("Error al cerrar la conexión a la base de datos:", err);
    throw err; // Re-lanza el error para que se pueda manejar en el nivel superior
  }
}

async function getDatabaseCacheTimeAndSize() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection();

    // Consulta SQL para obtener size en mb del buffer Database
    const query = `SELECT 
      TO_CHAR(SYSTIMESTAMP, 'HH24:MI:SS') as hora,
      value / 1024 / 1024 as MB
    FROM v$sga
    WHERE name='Database Buffers'`;
    //const query = `SELECT name FROM v$sga;`;
    //const query = `SELECT name, value /1024/1024 FROM v$sga`;
    // Ejecutar la consulta
    const result = await connection.execute(query);
    // Devolver el resultado de la consulta
    const time = result.rows.at(0).at(0);
    const size = result.rows.at(0).at(1);
    return { time, size };
  } catch (error) {
    console.error("Error al obtener información del SGA:", error);
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

getStats = async () => {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection();

    // Consulta SQL para obtener stats del pool
    const query = `select set_msize, cnum_repl, block_size/1024 /1024, physical_reads from v$BUFFER_POOL_STATISTICS`;
    // Ejecutar la consulta
    const result = await connection.execute(query);
    // Devolver el resultado de la consulta
    
    const set_msize = result.rows.at(0).at(0);
    const cnum_repl = result.rows.at(0).at(1);
    const block_size = result.rows.at(0).at(2);
    const physical_reads = result.rows.at(0).at(3);
    return { set_msize, cnum_repl, block_size, physical_reads };
  } catch (error) {
    console.error("Error al obtener información del SGA:", error);
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
};

async function get10SQLs() {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection();
    //consulta
    const query = `SELECT
    SQL_ID,
    SQL_TEXT,
    TO_CHAR(LAST_ACTIVE_TIME, 'DD-MON-YY') AS FECHA,
    TO_CHAR(LAST_ACTIVE_TIME, 'HH24:MI:SS') AS HORA,
    EXECUTIONS AS CONSUMO,
    ROWNUM AS ID,
    VSIZE(SQL_TEXT) / (1024 * 1024) AS MEMORY_USED_MB
  FROM (
    SELECT
      SQL_ID,
      SQL_TEXT,
      LAST_ACTIVE_TIME,
      EXECUTIONS
    FROM (
      SELECT
        SQL_ID,
        SQL_TEXT,
        LAST_ACTIVE_TIME,
        EXECUTIONS,
        RANK() OVER (ORDER BY VSIZE(SQL_TEXT) DESC) AS MEMORY_RANK
      FROM
        V$SQL
      WHERE
        ROWNUM <= 10 -- Cambia el número según la cantidad de consultas que desees mostrar
      ORDER BY
        LAST_ACTIVE_TIME DESC
    )
    WHERE MEMORY_RANK <= 10 -- Obtener las 10 consultas con mayor consumo de memoria
  )
  ORDER BY MEMORY_USED_MB DESC`;
    // Ejecutar la consulta
    const result = await connection.execute(query);
    // Devolver el resultado de la consulta
    const sqls = result.rows;
    console.log(sqls);
    return { sqls };
  } catch (error) {
    console.error("Error al obtener información del SGA:", error);
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

getTablespaceStats = async () => {
  let connection;
  try{
    connection = await oracledb.getConnection();

    const query = `select tablespace_name, 
    ROUND(user_bytes / (1024*1024),2) as free_bytes,
    ROUND(((bytes - user_bytes)/(1024*1024)), 2) as used_bytes,
    ROUND(bytes / (1024*1024),2) as max_size
  from (select tablespace_name, bytes, user_bytes from dba_data_files)
  group by tablespace_name, user_bytes, bytes`;

  const result = await connection.execute(query);

  let res = result.rows.reduce((acc, curr,) => [...acc, {tablespace_name: curr.at(0), 
                                                        free_bytes: curr.at(1), 
                                                        used_bytes: curr.at(2), 
                                                        max_size: curr.at(3)}], [])


  return res;
  }
  catch(err){
    console.error('Error al obtener información de los tablespaces: ', error);
    throw error;
  } finally {
    if(connection){
      try{
        await connection.close();
      } catch(error){
        console.error('Error al cerrar la conexión: ', error);
      }
    }
  }
}

getTablesInfo = async () => {
  let connection;
  try{
    connection = await oracledb.getConnection();

    const query = `WITH RankedTables AS (
      SELECT t.owner, t.table_name, s.bytes / 1024 / 1024 AS "Tamaño (MB)",
             s.tablespace_name,
             ROW_NUMBER() OVER (PARTITION BY s.tablespace_name ORDER BY s.bytes DESC) AS rn
      FROM dba_segments s
      INNER JOIN dba_tables t ON s.segment_name = t.table_name
      WHERE s.segment_type = 'TABLE'
    )
    SELECT owner, table_name, "Tamaño (MB)", tablespace_name
    FROM RankedTables
    WHERE rn = 1`;

  const result = await connection.execute(query);

  let res = result.rows.reduce((acc, curr,) => [...acc, {owner: curr.at(0), 
                                                        table_name: curr.at(1), 
                                                        tam: curr.at(2), 
                                                        tablespace_name: curr.at(3)}], [])
  
  return res;
}
catch(err){
  console.error('Error al obtener información de los tablespaces: ', error);
  throw error;
}
};


module.exports = {
  connectToDatabase,
  closeDatabase,
  getDatabaseCacheTimeAndSize,
  get10SQLs,
  getStats,
  getTablespaceStats,
  getTablesInfo
};
