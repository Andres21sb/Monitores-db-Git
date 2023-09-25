const express = require("express");
const router = express.Router();
const database = require('../js/db.js');


router.get('/', async (req, res) => {
    try {
      const bufferTimeAndSize = await database.getDatabaseCacheTimeAndSize();
      const stats = await database.getStats();
      const calc = memoryInUse(bufferTimeAndSize,stats);
      console.log(calc);
      res.json({calc});
    } catch (error) {
      console.error('Error al obtener información del SGA:', error);
      res.status(500).json({ error: 'Error al obtener información del SGA' });
    }
  });


//funcion para calcular tamaño de buffer usado
const memoryInUse = (bufferTimeAndSize, stats) => {
  const totalAllocated = stats.set_msize / 1024 / 1024;
  const block_size = stats.block_size;
  console.log("Physical -> " + stats.physical_reads);
  const inUse= stats.physical_reads*block_size;
  //const inUse = 860; // PARA PRUEBAS DE FRONTEND
  const freeMemory = bufferTimeAndSize.size - inUse;
  const time = bufferTimeAndSize.time;
  const fullSize = bufferTimeAndSize.size;
  return { totalAllocated, block_size, inUse, freeMemory, time, fullSize };
};

router.get("/sqls", async (req, res) => {
  try {
    const sqls = await database.get10SQLs();
    res.json({ sqls });
  } catch (error) {
    console.error("Error al obtener información del SGA:", error);
    res.status(500).json({ error: "Error al obtener información del SGA" });
  }
});

module.exports = router;
