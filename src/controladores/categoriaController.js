const db = require('../bancodedados/index');

const listarCategorias = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorias');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarCategorias,
};
