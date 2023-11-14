
const db = require('../bancodedados/index');
const bcrypt = require('bcrypt');


const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *', [
      nome,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const detalharUsuario = async (req, res) => {
  const id = req.user.id;

  try {
    const result = await db.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Perfil do usuário não encontrado' });
    } else {
      res.status(200).json({ data: result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editarPerfil = async (req, res) => {
  const { nome, email, senha } = req.body;
  const id = req.user.id;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos (nome, email, senha) são obrigatórios' });
    }

    const existingUser = await db.query('SELECT * FROM usuarios WHERE email = $1 AND id <> $2', [email, id]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'O e-mail já está em uso por outro usuário' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await db.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *', [
      nome,
      email,
      hashedPassword,
      id
    ]);

    res.status(200).json({ message: 'Perfil atualizado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  editarPerfil,
};
