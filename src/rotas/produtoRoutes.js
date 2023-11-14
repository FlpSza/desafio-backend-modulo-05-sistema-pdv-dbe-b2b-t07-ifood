const express = require('express');
const router = express.Router();
const produtoController = require('../controladores/produtoController');
const autenticacao = require('../intermediarios/auth');

router.use(autenticacao.verificarToken);

router.post('/produto', produtoController.cadastrarProduto);
router.put('/produto/:id', produtoController.editarProduto);
router.get('/produto', produtoController.listarProdutos);
router.get('/produto/:id', produtoController.detalharProduto);
router.delete('/produto/:id', produtoController.excluirProduto);
module.exports = router;
