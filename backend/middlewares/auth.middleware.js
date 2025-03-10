
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: 'Nenhum token fornecido!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado!' });
    }
    
    return res.status(401).json({ message: 'Não autorizado!' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Requer permissão de administrador!' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "Token de autenticação não fornecido!"
    });
  }

  // Remover 'Bearer ' se presente
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Verificar se o usuário ainda existe no banco de dados
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).send({
        message: "Usuário não encontrado!"
      });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).send({
        message: "Conta desativada. Entre em contato com o suporte."
      });
    }

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Token inválido ou expirado!"
    });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role !== "admin") {
      return res.status(403).send({
        message: "Acesso negado. Requer privilégios de administrador!"
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin
};

module.exports = authMiddleware;
