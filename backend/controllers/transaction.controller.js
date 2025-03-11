
const db = require("../models");
const Transaction = db.transaction;
const Category = db.category;

// Criar nova transação
exports.create = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.userId
    });
    
    return res.status(201).send(transaction);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter todas as transações do usuário
exports.findAll = async (req, res) => {
  try {
    const { type, startDate, endDate, categoryId, channelId } = req.query;
    const where = { userId: req.userId };
    
    if (type) {
      where.type = type;
    }
    
    if (startDate && endDate) {
      where.date = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.date = {
        [db.Sequelize.Op.gte]: startDate
      };
    } else if (endDate) {
      where.date = {
        [db.Sequelize.Op.lte]: endDate
      };
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (channelId) {
      where.channelId = channelId;
    }
    
    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'category'
        }
      ],
      order: [['date', 'DESC']]
    });
    
    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter uma transação específica
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });
    
    if (!transaction) {
      return res.status(404).send({ message: "Transação não encontrada." });
    }
    
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar uma transação
exports.update = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!transaction) {
      return res.status(404).send({ message: "Transação não encontrada." });
    }
    
    await transaction.update(req.body);
    
    return res.status(200).send({
      message: "Transação atualizada com sucesso!",
      transaction
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Excluir uma transação
exports.delete = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!transaction) {
      return res.status(404).send({ message: "Transação não encontrada." });
    }
    
    await transaction.destroy();
    
    return res.status(200).send({ message: "Transação excluída com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter resumo financeiro
exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate, channelId } = req.query;
    const where = { userId: req.userId };
    
    if (startDate && endDate) {
      where.date = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.date = {
        [db.Sequelize.Op.gte]: startDate
      };
    } else if (endDate) {
      where.date = {
        [db.Sequelize.Op.lte]: endDate
      };
    }
    
    if (channelId) {
      where.channelId = channelId;
    }
    
    // Total de receitas
    const totalIncome = await Transaction.sum('amount', {
      where: {
        ...where,
        type: 'income'
      }
    }) || 0;
    
    // Total de despesas
    const totalExpense = await Transaction.sum('amount', {
      where: {
        ...where,
        type: 'expense'
      }
    }) || 0;
    
    // Balanço
    const balance = totalIncome - totalExpense;
    
    // Transações por categoria
    const categories = await Category.findAll({
      include: [
        {
          model: Transaction,
          as: 'transactions',
          where,
          attributes: []
        }
      ],
      attributes: [
        'id',
        'name',
        'type',
        'color',
        'icon',
        [db.sequelize.fn('SUM', db.sequelize.col('transactions.amount')), 'total']
      ],
      group: ['category.id'],
      having: db.sequelize.literal('COUNT("transactions"."id") > 0'),
      order: [[db.sequelize.literal('total'), 'DESC']]
    });
    
    return res.status(200).send({
      totalIncome,
      totalExpense,
      balance,
      categories
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
const { supabaseClient } = require('../config/supabase.config');

/**
 * Obter todas as transações do usuário
 */
const getAllTransactions = async (req, res) => {
  const { limit = 20, offset = 0, sort = 'date', order = 'desc', type } = req.query;
  const userId = req.user.id;
  
  try {
    let query = supabaseClient
      .from('financial_transactions')
      .select(`
        *,
        transaction_categories(id, name, type, color, icon),
        payment_methods(id, name, icon)
      `)
      .eq('user_id', userId)
      .order(sort, { ascending: order === 'asc' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    // Filtrar por tipo se fornecido
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      transactions: data,
      total: count
    });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter transações por período
 */
const getTransactionsByPeriod = async (req, res) => {
  const { start_date, end_date, type } = req.query;
  const userId = req.user.id;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ message: 'Data inicial e final são obrigatórias' });
  }
  
  try {
    let query = supabaseClient
      .from('financial_transactions')
      .select(`
        *,
        transaction_categories(id, name, type, color, icon),
        payment_methods(id, name, icon)
      `)
      .eq('user_id', userId)
      .gte('date', start_date)
      .lte('date', end_date)
      .order('date', { ascending: false });
    
    // Filtrar por tipo se fornecido
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      transactions: data
    });
  } catch (error) {
    console.error('Erro ao buscar transações por período:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter resumo financeiro
 */
const getFinancialSummary = async (req, res) => {
  const { start_date, end_date } = req.query;
  const userId = req.user.id;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ message: 'Data inicial e final são obrigatórias' });
  }
  
  try {
    // Buscar todas as transações no período
    const { data: transactions, error } = await supabaseClient
      .from('financial_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', start_date)
      .lte('date', end_date);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Calcular resumo
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = income - expense;
    
    // Agrupar por categoria
    const categorySummary = {};
    
    for (const transaction of transactions) {
      const categoryId = transaction.category_id;
      
      if (!categorySummary[categoryId]) {
        categorySummary[categoryId] = {
          category_id: categoryId,
          total: 0,
          count: 0
        };
      }
      
      categorySummary[categoryId].total += parseFloat(transaction.amount);
      categorySummary[categoryId].count += 1;
    }
    
    // Buscar dados de categorias para complementar o resumo
    if (Object.keys(categorySummary).length > 0) {
      const { data: categories, error: categoryError } = await supabaseClient
        .from('transaction_categories')
        .select('id, name, type, color, icon')
        .in('id', Object.keys(categorySummary));
      
      if (!categoryError && categories) {
        categories.forEach(category => {
          if (categorySummary[category.id]) {
            categorySummary[category.id] = {
              ...categorySummary[category.id],
              name: category.name,
              type: category.type,
              color: category.color,
              icon: category.icon
            };
          }
        });
      }
    }
    
    return res.status(200).json({
      summary: {
        income,
        expense,
        balance,
        categories: Object.values(categorySummary)
      }
    });
  } catch (error) {
    console.error('Erro ao gerar resumo financeiro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter uma transação específica
 */
const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('financial_transactions')
      .select(`
        *,
        transaction_categories(id, name, type, color, icon),
        payment_methods(id, name, icon)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    return res.status(200).json({ 
      transaction: data
    });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Criar uma nova transação
 */
const createTransaction = async (req, res) => {
  const {
    date,
    description,
    amount,
    type,
    category_id,
    payment_method_id,
    is_recurring,
    recurrence_period,
    recurrence_end_date,
    tags,
    receipt_url
  } = req.body;
  
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('financial_transactions')
      .insert({
        user_id: userId,
        date,
        description,
        amount,
        type,
        category_id,
        payment_method_id,
        is_recurring: is_recurring || false,
        recurrence_period,
        recurrence_end_date,
        tags,
        receipt_url
      })
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction: data[0]
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar uma transação existente
 */
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const {
    date,
    description,
    amount,
    type,
    category_id,
    payment_method_id,
    is_recurring,
    recurrence_period,
    recurrence_end_date,
    tags,
    receipt_url
  } = req.body;
  
  const userId = req.user.id;
  
  try {
    // Verificar se a transação pertence ao usuário
    const { data: existingTransaction, error: findError } = await supabaseClient
      .from('financial_transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingTransaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    // Atualizar a transação
    const { data, error } = await supabaseClient
      .from('financial_transactions')
      .update({
        date,
        description,
        amount,
        type,
        category_id,
        payment_method_id,
        is_recurring: is_recurring || false,
        recurrence_period,
        recurrence_end_date,
        tags,
        receipt_url,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Transação atualizada com sucesso',
      transaction: data[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Excluir uma transação
 */
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Verificar se a transação pertence ao usuário
    const { data: existingTransaction, error: findError } = await supabaseClient
      .from('financial_transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingTransaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    // Excluir a transação
    const { error } = await supabaseClient
      .from('financial_transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Transação excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionsByPeriod,
  getFinancialSummary,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
