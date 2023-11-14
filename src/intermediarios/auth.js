const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  if (req.path === '/login' || req.path === '/categoria') {
    return next();
  }
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido ou mal formatado' });
  }

  const tokenJWT = token.slice(7);

  try {
    const decoded = jwt.verify(tokenJWT, 'password');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticação inválido' });
  }
};

module.exports = {
  verificarToken
};
