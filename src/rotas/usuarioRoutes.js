const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioController');
const autenticacao = require('../intermediarios/auth');

router.post('/cadastro', usuarioController.cadastrarUsuario);

router.use(autenticacao.verificarToken);

router.get('/usuario/:id', usuarioController.detalharUsuario)
router.put('/usuario', usuarioController.editarPerfil);



module.exports = router;
