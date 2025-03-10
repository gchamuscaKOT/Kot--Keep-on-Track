
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
