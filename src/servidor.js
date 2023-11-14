require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const pool = require('./bancodedados/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const usuarioRoutes = require('./rotas/usuarioRoutes');
const autenticacaoRoutes = require('./rotas/autenticacaoRoutes');
const categoriaRoutes = require('./rotas/categoriaRoutes');
const produtoRoutes = require('./rotas/produtoRoutes');
const clienteRoutes = require('./rotas/clienteRoutes')
const pedidoRoutes = require('./rotas/pedidoRoutes')

app.use(usuarioRoutes);
app.use(autenticacaoRoutes);
app.use(categoriaRoutes);
app.use(produtoRoutes);
app.use(clienteRoutes);
app.use(pedidoRoutes)

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro na conexão com o banco de dados', err);
  } else {
    console.log('Conexão bem-sucedida com o banco de dados');
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
