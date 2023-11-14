const db = require('../bancodedados/index');

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  const categoriaExistsQuery = 'SELECT * FROM categorias WHERE id = $1';
  const categoriaExistsValues = [categoria_id];

  try {
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

module.exports = {
  cadastrarProduto,
};
