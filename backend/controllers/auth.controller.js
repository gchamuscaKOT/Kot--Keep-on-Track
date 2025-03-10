
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
