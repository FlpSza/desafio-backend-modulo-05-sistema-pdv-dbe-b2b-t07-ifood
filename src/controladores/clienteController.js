const db = require('../bancodedados/index');
const bcrypt = require('bcrypt');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
  
    if (!nome || !email || !cpf) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }
  
    try {
      const emailExistQuery = 'SELECT * FROM clientes WHERE email = $1';
      const emailExistValues = [email];
      const emailExistResult = await db.query(emailExistQuery, emailExistValues);
  
      if (emailExistResult.rows.length > 0) {
        return res.status(400).json({ message: 'O e-mail informado já está em uso por outro cliente' });
      }
  
      const cpfExistQuery = 'SELECT * FROM clientes WHERE cpf = $1';
      const cpfExistValues = [cpf];
      const cpfExistResult = await db.query(cpfExistQuery, cpfExistValues);
  
      if (cpfExistResult.rows.length > 0) {
        return res.status(400).json({ message: 'O CPF informado já está em uso por outro cliente' });
      }
  
      const cadastrarClienteQuery = 'INSERT INTO clientes (nome, email, cpf, cep, rua, numero, bairro, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      const cadastrarClienteValues = [nome, email, cpf, cep, rua, numero, bairro, cidade, estado];
      const clienteCadastrado = await db.query(cadastrarClienteQuery, cadastrarClienteValues);
  
      res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: clienteCadastrado.rows[0] });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  
  const editarCliente = async (req, res) => {
    const clienteId = req.params.id;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
  
    if (!nome || !email || !cpf) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }
  
    try {
      const clienteExistQuery = 'SELECT * FROM clientes WHERE id = $1';
      const clienteExistValues = [clienteId];
      const clienteExistResult = await db.query(clienteExistQuery, clienteExistValues);
  
      if (clienteExistResult.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
  
      const emailExistQuery = 'SELECT * FROM clientes WHERE email = $1 AND id <> $2';
      const emailExistValues = [email, clienteId];
      const emailExistResult = await db.query(emailExistQuery, emailExistValues);
  
      if (emailExistResult.rows.length > 0) {
        return res.status(400).json({ message: 'O e-mail informado já está em uso por outro cliente' });
      }
  
      const cpfExistQuery = 'SELECT * FROM clientes WHERE cpf = $1 AND id <> $2';
      const cpfExistValues = [cpf, clienteId];
      const cpfExistResult = await db.query(cpfExistQuery, cpfExistValues);
  
      if (cpfExistResult.rows.length > 0) {
        return res.status(400).json({ message: 'O CPF informado já está em uso por outro cliente' });
      }
  
      const editarClienteQuery = 'UPDATE clientes SET nome = $1, email = $2, cpf = $3, cep = $4, rua = $5, numero = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $10 RETURNING *';
      const editarClienteValues = [nome, email, cpf, cep, rua, numero, bairro, cidade, estado, clienteId];
      const clienteAtualizado = await db.query(editarClienteQuery, editarClienteValues);
  
      res.status(200).json({ message: 'Cliente atualizado com sucesso', cliente: clienteAtualizado.rows[0] });
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

  const listarClientes = async (req, res) => {
    try {
      const listarClientesQuery = 'SELECT * FROM clientes';
      const clientes = await db.query(listarClientesQuery);
  
      res.status(200).json(clientes.rows);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

  const detalharCliente = async (req, res) => {
    const clienteId = req.params.id;
  
    try {
      const detalharClienteQuery = 'SELECT * FROM clientes WHERE id = $1';
      const detalharClienteValues = [clienteId];
      const cliente = await db.query(detalharClienteQuery, detalharClienteValues);
  
      if (cliente.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
  
      res.status(200).json(cliente.rows[0]);
    } catch (error) {
      console.error('Erro ao detalhar cliente:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  
  module.exports = {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente,
  };
  