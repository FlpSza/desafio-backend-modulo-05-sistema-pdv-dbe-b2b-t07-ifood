const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../bancodedados/index');
const armazenamentoImagem = '../img';

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  const categoriaExistsQuery = 'SELECT * FROM categorias WHERE id = $1';
  const categoriaExistsValues = [categoria_id];

  try {
    let produtoImagem = null;
    if (req.file) {
      const imagemTemporaria = req.file.path;
      const extensao = path.extname(req.file.originalname).toLowerCase();
      const novoNomeImagem = `${uuidv4()}${extensao}`;
      const caminhoDestino = path.join(armazenamentoImagem, novoNomeImagem);

      fs.renameSync(imagemTemporaria, caminhoDestino);
      produtoImagem = `https://seu-servidor.com/${novoNomeImagem}`;
    }
    const categoriaExistsResult = await db.query(categoriaExistsQuery, categoriaExistsValues);

    if (categoriaExistsResult.rows.length === 0) {
      return res.status(400).json({ message: 'A categoria informada não existe' });
    }

    const cadastrarProdutoQuery = 'INSERT INTO produtos (descricao, quantidade_estoque, valor, categoria_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const cadastrarProdutoValues = [descricao, quantidade_estoque, valor, categoria_id];

    const novoProduto = await db.query(cadastrarProdutoQuery, cadastrarProdutoValues);

    res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto.rows[0] });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


const editarProduto = async (req, res) => {
    const produtoId = req.params.id;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  
    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }
  
    try {
      let produtoImagem = null;
      if (req.file) {
        const imagemTemporaria = req.file.path;
        const extensao = path.extname(req.file.originalname).toLowerCase();
        const novoNomeImagem = `${uuidv4()}${extensao}`;
        const caminhoDestino = path.join(armazenamentoImagem, novoNomeImagem);
  
        fs.renameSync(imagemTemporaria, caminhoDestino);
        produtoImagem = `https://seu-servidor.com/${novoNomeImagem}`;
      }
      const produtoExistQuery = 'SELECT * FROM produtos WHERE id = $1';
      const produtoExistValues = [produtoId];
      const produtoExistResult = await db.query(produtoExistQuery, produtoExistValues);
  
      if (produtoExistResult.rows.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
  
      const categoriaExistQuery = 'SELECT * FROM categorias WHERE id = $1';
      const categoriaExistValues = [categoria_id];
      const categoriaExistResult = await db.query(categoriaExistQuery, categoriaExistValues);
  
      if (categoriaExistResult.rows.length === 0) {
        return res.status(400).json({ message: 'A categoria informada não existe' });
      }
  
      const editarProdutoQuery = 'UPDATE produtos SET descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4 WHERE id = $5 RETURNING *';
      const editarProdutoValues = [descricao, quantidade_estoque, valor, categoria_id, produtoId];
      const produtoEditado = await db.query(editarProdutoQuery, editarProdutoValues);
  
      res.status(200).json({ message: 'Produto atualizado com sucesso', produto: produtoEditado.rows[0] });
    } catch (error) {
      console.error('Erro ao editar produto:', error);
  
      if (error.message.includes('does not exist')) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
  
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

  const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;
  
    try {
      let query = 'SELECT * FROM produtos';
  
      if (categoria_id) {
        query += ' WHERE categoria_id = $1';
  
        const categoriaExistQuery = 'SELECT * FROM categorias WHERE id = $1';
        const categoriaExistValues = [categoria_id];
        const categoriaExistResult = await db.query(categoriaExistQuery, categoriaExistValues);
  
        if (categoriaExistResult.rows.length === 0) {
          return res.status(400).json({ message: 'A categoria informada não existe' });
        }
      }
  
      const result = await db.query(query, categoria_id ? [categoria_id] : []);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

  const detalharProduto = async (req, res) => {
    const produtoId = req.params.id;
  
    try {
      const produtoExistQuery = 'SELECT * FROM produtos WHERE id = $1';
      const produtoExistValues = [produtoId];
      const produtoExistResult = await db.query(produtoExistQuery, produtoExistValues);
  
      if (produtoExistResult.rows.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
  
      res.status(200).json({ produto: produtoExistResult.rows[0] });
    } catch (error) {
      console.error('Erro ao detalhar produto:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

  const excluirProduto = async (req, res) => {
    const produtoId = req.params.id;
  
    try {
      const produtoExistQuery = 'SELECT * FROM produtos WHERE id = $1';
      const produtoExistValues = [produtoId];
      const produtoExistResult = await db.query(produtoExistQuery, produtoExistValues);
  
      if (produtoExistResult.rows.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
  
      const pedidoProdutoResult = await db.query('SELECT * FROM pedido_produtos WHERE produto_id = $1', [produtoId]);
  
      if (pedidoProdutoResult.rows.length > 0) {
        return res.status(400).json({ message: 'Este produto está vinculado a um pedido e não pode ser excluído.' });
      }
  
      const excluirProdutoQuery = 'DELETE FROM produtos WHERE id = $1';
      const excluirProdutoValues = [produtoId];
      await db.query(excluirProdutoQuery, excluirProdutoValues);
  
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  

  
module.exports = {
  cadastrarProduto,
  editarProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
};
