
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateTokens = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION
  });

  return { token, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso!' });
    }

    // Criar novo usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'creator'
    });

    const { token, refreshToken } = generateTokens(user);

    // Atualizar o refreshToken no banco de dados
    await user.update({ refreshToken });

    // Remover a senha da resposta
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: userResponse,
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Verificar a senha
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Senha inválida!' });
    }

    const { token, refreshToken } = generateTokens(user);

    // Atualizar o refreshToken no banco de dados
    await user.update({ refreshToken });

    // Remover a senha da resposta
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(200).json({
      user: userResponse,
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token é obrigatório!' });
    }

    // Verificar se o refresh token é válido
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return res.status(403).json({ message: 'Refresh token inválido!' });
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      const { token, refreshToken: newRefreshToken } = generateTokens(user);

      // Atualizar o refreshToken no banco de dados
      await user.update({ refreshToken: newRefreshToken });

      res.status(200).json({
        token,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      // Se o refresh token expirou, remover do banco de dados
      await user.update({ refreshToken: null });
      return res.status(403).json({ message: 'Refresh token expirado. Faça login novamente.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório!' });
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (user) {
      // Limpar o refreshToken no banco de dados
      await user.update({ refreshToken: null });
    }

    res.status(200).json({ message: 'Logout realizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    // Criar usuário
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      fullName: req.body.fullName || req.body.username
    });

    return res.status(201).send({ 
      message: "Usuário registrado com sucesso!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Senha inválida!"
      });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRATION) // 24 horas
    });

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
const { supabaseClient } = require('../config/supabase.config');

/**
 * Registrar um novo usuário
 */
const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Registrar usuário no Supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ 
      message: 'Usuário registrado com sucesso',
      user: data.user 
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Login de usuário
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Autenticar usuário no Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(200).json({ 
      message: 'Login realizado com sucesso',
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Logout de usuário
 */
const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Encerrar sessão no Supabase
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Resetar senha de usuário
 */
const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email é obrigatório' });
  }

  try {
    // Enviar email de recuperação de senha
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ 
      message: 'Email de recuperação de senha enviado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  register,
  login,
  logout,
  resetPassword
};
