const express = require('express');
const router = express.Router();
const autenticacaoController = require('../controladores/autenticacaoController');


router.post('/login', autenticacaoController.efetuarLogin);


module.exports = router;
