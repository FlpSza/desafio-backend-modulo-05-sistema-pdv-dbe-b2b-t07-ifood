const express = require('express');
const router = express.Router();
const pedidoController = require('../controladores/pedidoController');
const autenticacao = require('../intermediarios/auth');

router.use(autenticacao.verificarToken);

router.post('/pedido', pedidoController.cadastrarPedido);
router.get('/pedido', pedidoController.listarPedidos);

module.exports = router;
