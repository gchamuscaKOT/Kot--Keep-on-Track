
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
