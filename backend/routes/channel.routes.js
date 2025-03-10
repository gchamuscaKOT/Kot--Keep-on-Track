
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

// Importar controller quando for criado
// const channelController = require('../controllers/channel.controller');

// Rota protegida para canais (a ser implementada)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: "Lista de canais do usuário" });
});

module.exports = router;
