
const db = require("../models");
const Category = db.category;

// Criar nova categoria
exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    
    return res.status(201).send(category);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter todas as categorias
exports.findAll = async (req, res) => {
  try {
    const { type } = req.query;
    const where = {};
    
    if (type) {
      where.type = type;
    }
    
    const categories = await Category.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter uma categoria específica
exports.findOne = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).send({ message: "Categoria não encontrada." });
    }
    
    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar uma categoria
exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).send({ message: "Categoria não encontrada." });
    }
    
    await category.update(req.body);
    
    return res.status(200).send({
      message: "Categoria atualizada com sucesso!",
      category
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Excluir uma categoria
exports.delete = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).send({ message: "Categoria não encontrada." });
    }
    
    await category.destroy();
    
    return res.status(200).send({ message: "Categoria excluída com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
