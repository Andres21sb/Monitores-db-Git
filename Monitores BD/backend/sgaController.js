const express = require('express');
const router = express.Router();
const database= require('../js/db.js');


router.get('/', async (req, res) => {
    try {
      const sgaUsage = await database.getSGAUsage();
      res.json(sgaUsage);
    } catch (error) {
      console.error('Error al obtener información del SGA:', error);
      res.status(500).json({ error: 'Error al obtener información del SGA' });
    }
  });
  module.exports = router;