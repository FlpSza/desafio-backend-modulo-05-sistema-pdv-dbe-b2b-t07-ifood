const db = require('../bancodedados/index');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
  
    if (!cliente_id || !pedido_produtos || pedido_produtos.length === 0) {
      return res.status(400).json({ message: 'Os campos cliente_id e pedido_produtos são obrigatórios' });
    }
  
    try {
      const clienteExistQuery = 'SELECT * FROM clientes WHERE id = $1';
      const clienteExistValues = [cliente_id];
      const clienteExistResult = await db.query(clienteExistQuery, clienteExistValues);
  
      if (clienteExistResult.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
  
      for (const pedidoProduto of pedido_produtos) {
        const { produto_id, quantidade_produto } = pedidoProduto;
  
        const produtoExistQuery = 'SELECT * FROM produtos WHERE id = $1';
        const produtoExistValues = [produto_id];
        const produtoExistResult = await db.query(produtoExistQuery, produtoExistValues);
  
        if (produtoExistResult.rows.length === 0) {
          return res.status(404).json({ message: `Produto com id ${produto_id} não encontrado` });
        }
  
        const quantidadeEstoque = produtoExistResult.rows[0].quantidade_estoque;
        if (quantidade_produto > quantidadeEstoque) {
          return res.status(400).json({ message: `Quantidade em estoque insuficiente para o produto com id ${produto_id}` });
        }
      }
  
      const cadastrarPedidoQuery = 'INSERT INTO pedidos (cliente_id, observacao) VALUES ($1, $2) RETURNING *';
      const cadastrarPedidoValues = [cliente_id, observacao];
      const pedidoCadastrado = await db.query(cadastrarPedidoQuery, cadastrarPedidoValues);
  
      const pedidoId = pedidoCadastrado.rows[0].id;
  
      for (const pedidoProduto of pedido_produtos) {
        const { produto_id, quantidade_produto } = pedidoProduto;
  
        const cadastrarPedidoProdutoQuery = 'INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade_produto) VALUES ($1, $2, $3)';
        const cadastrarPedidoProdutoValues = [pedidoId, produto_id, quantidade_produto];
        await db.query(cadastrarPedidoProdutoQuery, cadastrarPedidoProdutoValues);
      }
    
      res.status(201).json({ message: 'Pedido cadastrado com sucesso' });
    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  
  const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;
  
    try {
      let listarPedidosQuery = 'SELECT * FROM pedidos';
      let listarPedidosValues = [];
  
      if (cliente_id) {
        listarPedidosQuery += ' WHERE cliente_id = $1';
        listarPedidosValues = [cliente_id];
      }
  
      const pedidosResult = await db.query(listarPedidosQuery, listarPedidosValues);
  
      const pedidos = [];
  
      for (const pedidoRow of pedidosResult.rows) {
        const pedido = {
          id: pedidoRow.id,
          valor_total: pedidoRow.valor_total,
          observacao: pedidoRow.observacao,
          cliente_id: pedidoRow.cliente_id,
        };
  
        const listarPedidoProdutosQuery = 'SELECT * FROM pedido_produtos WHERE pedido_id = $1';
        const listarPedidoProdutosValues = [pedidoRow.id];
        const pedidoProdutosResult = await db.query(listarPedidoProdutosQuery, listarPedidoProdutosValues);
  
        const pedidoProdutos = pedidoProdutosResult.rows.map((produtoRow) => ({
          id: produtoRow.id,
          quantidade_produto: produtoRow.quantidade_produto,
          valor_produto: produtoRow.valor_produto,
          pedido_id: produtoRow.pedido_id,
          produto_id: produtoRow.produto_id,
        }));
  
        pedidos.push({
          pedido,
          pedido_produtos: pedidoProdutos,
        });
      }
  
      res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };


  module.exports = {
    cadastrarPedido,
    listarPedidos,
  };
  