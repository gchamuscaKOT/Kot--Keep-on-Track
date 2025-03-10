
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
const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channel.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateChannel } = require("../middlewares/validation.middleware");

// Rotas de canais
router.post("/", verifyToken, validateChannel, channelController.create);
router.get("/", verifyToken, channelController.findAll);
router.get("/:id", verifyToken, channelController.findOne);
router.get("/:id/stats", verifyToken, channelController.getStats);
router.put("/:id", verifyToken, validateChannel, channelController.update);
router.delete("/:id", verifyToken, channelController.delete);

module.exports = router;
