
const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');
const router = express.Router();

// Rotas de autenticação
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateSignUp, validateSignIn } = require("../middlewares/validation.middleware");

// Rotas de autenticação
router.post("/signup", validateSignUp, authController.signup);
router.post("/signin", validateSignIn, authController.signin);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota para registro de usuário
router.post('/register', authController.register);

// Rota para login
router.post('/login', authController.login);

// Rota para logout
router.post('/logout', authController.logout);

// Rota para resetar senha
router.post('/reset-password', authController.resetPassword);

module.exports = router;
