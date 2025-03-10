
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

// Importar controller quando for criado
// const taskController = require('../controllers/task.controller');

// Rota protegida para tarefas (a ser implementada)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: "Lista de tarefas do usuário" });
});

module.exports = router;
