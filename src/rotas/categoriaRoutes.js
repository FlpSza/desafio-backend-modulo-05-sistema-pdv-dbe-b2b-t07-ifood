const express = require('express');
const router = express.Router();
const categoriaController = require('../controladores/categoriaController');

router.get('/categoria', categoriaController.listarCategorias);


module.exports = router;
