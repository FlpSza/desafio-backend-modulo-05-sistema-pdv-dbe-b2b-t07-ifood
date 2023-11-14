const express = require('express');
const router = express.Router();
const clienteController = require('../controladores/clienteController');
const autenticacao = require('../intermediarios/auth');


router.use(autenticacao.verificarToken);

router.post('/cliente', clienteController.cadastrarCliente);
router.put('/cliente/:id', clienteController.editarCliente);
router.get('/cliente', clienteController.listarClientes);
router.get('/cliente/:id', clienteController.detalharCliente);

module.exports = router;
