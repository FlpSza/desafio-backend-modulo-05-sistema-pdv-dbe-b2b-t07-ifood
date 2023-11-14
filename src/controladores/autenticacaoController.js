const db = require('../bancodedados/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const efetuarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (senhaCorreta) {
      const token = jwt.sign({ email: usuario.email, id: usuario.id }, 'password', { expiresIn: '8h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  efetuarLogin,
};
