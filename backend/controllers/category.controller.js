
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
const { supabaseClient } = require('../config/supabase.config');

/**
 * Obter todas as categorias do usuário
 */
const getAllCategories = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('transaction_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      categories: data 
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter categorias por tipo (income/expense)
 */
const getCategoriesByType = async (req, res) => {
  const { type } = req.params;
  const userId = req.user.id;
  
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: 'Tipo inválido. Use income ou expense.' });
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('transaction_categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('name');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      categories: data 
    });
  } catch (error) {
    console.error('Erro ao buscar categorias por tipo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter uma categoria específica
 */
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('transaction_categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    return res.status(200).json({ 
      category: data 
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Criar uma nova categoria
 */
const createCategory = async (req, res) => {
  const { name, type, color, icon } = req.body;
  const userId = req.user.id;
  
  try {
    // Verificar se já existe uma categoria com o mesmo nome e tipo
    const { data: existing, error: existingError } = await supabaseClient
      .from('transaction_categories')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name)
      .eq('type', type);
    
    if (!existingError && existing.length > 0) {
      return res.status(400).json({ message: 'Já existe uma categoria com este nome e tipo' });
    }
    
    // Criar categoria
    const { data, error } = await supabaseClient
      .from('transaction_categories')
      .insert({
        user_id: userId,
        name,
        type,
        color,
        icon,
        is_default: false
      })
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(201).json({
      message: 'Categoria criada com sucesso',
      category: data[0]
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar uma categoria existente
 */
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type, color, icon } = req.body;
  const userId = req.user.id;
  
  try {
    // Verificar se a categoria existe e pertence ao usuário
    const { data: existingCategory, error: findError } = await supabaseClient
      .from('transaction_categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingCategory) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    // Não permitir alteração de categorias padrão
    if (existingCategory.is_default) {
      return res.status(403).json({ message: 'Categorias padrão não podem ser modificadas' });
    }
    
    // Verificar duplicidade com outra categoria (exceto a atual)
    const { data: duplicate, error: duplicateError } = await supabaseClient
      .from('transaction_categories')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name)
      .eq('type', type)
      .neq('id', id);
    
    if (!duplicateError && duplicate.length > 0) {
      return res.status(400).json({ message: 'Já existe outra categoria com este nome e tipo' });
    }
    
    // Atualizar categoria
    const { data, error } = await supabaseClient
      .from('transaction_categories')
      .update({
        name,
        type,
        color,
        icon
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Categoria atualizada com sucesso',
      category: data[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Excluir uma categoria
 */
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Verificar se a categoria existe e pertence ao usuário
    const { data: existingCategory, error: findError } = await supabaseClient
      .from('transaction_categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingCategory) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    // Não permitir exclusão de categorias padrão
    if (existingCategory.is_default) {
      return res.status(403).json({ message: 'Categorias padrão não podem ser excluídas' });
    }
    
    // Verificar se existem transações usando esta categoria
    const { data: relatedTransactions, error: relatedError } = await supabaseClient
      .from('financial_transactions')
      .select('id')
      .eq('category_id', id)
      .eq('user_id', userId);
    
    if (!relatedError && relatedTransactions.length > 0) {
      return res.status(400).json({ 
        message: 'Esta categoria não pode ser excluída porque está sendo usada em transações' 
      });
    }
    
    // Excluir categoria
    const { error } = await supabaseClient
      .from('transaction_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Categoria excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
