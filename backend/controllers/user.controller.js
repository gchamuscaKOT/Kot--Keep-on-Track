
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    
    // Atualizar informações do usuário
    await user.update({
      fullName: req.body.fullName || user.fullName,
      bio: req.body.bio || user.bio,
      profileImage: req.body.profileImage || user.profileImage
    });
    
    return res.status(200).send({ 
      message: "Perfil atualizado com sucesso!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    
    // Verificar senha atual
    const passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Senha atual incorreta!" });
    }
    
    // Atualizar senha
    await user.update({
      password: bcrypt.hashSync(req.body.newPassword, 8)
    });
    
    return res.status(200).send({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
const { supabaseClient } = require('../config/supabase.config');

/**
 * Obter perfil do usuário autenticado
 */
const getProfile = async (req, res) => {
  try {
    // Perfil do usuário já está disponível na requisição após autenticação
    return res.status(200).json({ 
      user: req.user 
    });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar perfil do usuário
 */
const updateProfile = async (req, res) => {
  const { full_name, avatar_url, website, bio } = req.body;
  const userId = req.user.id;

  try {
    // Atualizar dados do usuário no Supabase
    const { data, error } = await supabaseClient.auth.updateUser({
      data: {
        full_name: full_name || req.user.user_metadata?.full_name,
        avatar_url: avatar_url || req.user.user_metadata?.avatar_url,
        website: website || req.user.user_metadata?.website,
        bio: bio || req.user.user_metadata?.bio
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ 
      message: 'Perfil atualizado com sucesso',
      user: data.user 
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Alterar senha do usuário
 */
const changePassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Nova senha é obrigatória' });
  }

  try {
    // Atualizar senha no Supabase
    const { error } = await supabaseClient.auth.updateUser({
      password: password
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ 
      message: 'Senha alterada com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
