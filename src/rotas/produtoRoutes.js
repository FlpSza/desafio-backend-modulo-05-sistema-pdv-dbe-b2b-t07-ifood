const express = require('express');
const router = express.Router();
const produtoController = require('../controladores/produtoController');
const autenticacao = require('../intermediarios/auth');

router.use(autenticacao.verificarToken);

router.post('/produto', produtoController.cadastrarProduto);

module.exports = router;
