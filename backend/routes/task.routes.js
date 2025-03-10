
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
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateTask } = require("../middlewares/validation.middleware");

// Rotas de tarefas
router.post("/", verifyToken, validateTask, taskController.create);
router.get("/", verifyToken, taskController.findAll);
router.get("/:id", verifyToken, taskController.findOne);
router.put("/:id", verifyToken, validateTask, taskController.update);
router.put("/:id/status", verifyToken, taskController.updateStatus);
router.delete("/:id", verifyToken, taskController.delete);

module.exports = router;
