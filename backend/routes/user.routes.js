
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Importar controller quando for criado
// const userController = require('../controllers/user.controller');

// Rotas protegidas de usuários (a serem implementadas)
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: "Rota de perfil do usuário" });
});

router.get('/', [verifyToken, isAdmin], (req, res) => {
  res.status(200).json({ message: "Lista de usuários - apenas admin" });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Rotas de usuário
router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);
router.put("/change-password", verifyToken, userController.changePassword);

module.exports = router;
