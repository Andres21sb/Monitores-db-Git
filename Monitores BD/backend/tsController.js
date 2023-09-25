const express = require("express");
const router = express.Router();
const database = require("../js/db.js");

router.get("/tsstats", async (req, res) => {
  try {
    const stats = await database.getTablespaceStats();
    console.log(stats);
    res.json(stats);
  } catch (error) {
    console.error("Error al obtener información de tablespaces: ", error);
    res
      .status(500)
      .json({ error: "Error al obtener información de tablespaces" });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const tables = await database.getTablesInfo();
    console.log(tables);
    res.json(tables);
  } catch (error) {
    console.error("Error al obtener información de tablas: ", error);
    res.status(500).json({ error: "Error al obtener información de tablas" });
  }
});

module.exports = router;
