
const db = require("../models");
const Channel = db.channel;
const Transaction = db.transaction;

// Criar novo canal
exports.create = async (req, res) => {
  try {
    const channel = await Channel.create({
      ...req.body,
      userId: req.userId
    });
    
    return res.status(201).send(channel);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter todos os canais do usuário
exports.findAll = async (req, res) => {
  try {
    const { type } = req.query;
    const where = { userId: req.userId };
    
    if (type) {
      where.type = type;
    }
    
    const channels = await Channel.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    return res.status(200).send(channels);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter um canal específico
exports.findOne = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!channel) {
      return res.status(404).send({ message: "Canal não encontrado." });
    }
    
    return res.status(200).send(channel);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar um canal
exports.update = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!channel) {
      return res.status(404).send({ message: "Canal não encontrado." });
    }
    
    await channel.update(req.body);
    
    return res.status(200).send({
      message: "Canal atualizado com sucesso!",
      channel
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Excluir um canal
exports.delete = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!channel) {
      return res.status(404).send({ message: "Canal não encontrado." });
    }
    
    await channel.destroy();
    
    return res.status(200).send({ message: "Canal excluído com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter estatísticas de um canal
exports.getStats = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!channel) {
      return res.status(404).send({ message: "Canal não encontrado." });
    }
    
    // Total de receitas do canal
    const totalIncome = await Transaction.sum('amount', {
      where: {
        channelId: channel.id,
        type: 'income'
      }
    }) || 0;
    
    // Total de despesas do canal
    const totalExpense = await Transaction.sum('amount', {
      where: {
        channelId: channel.id,
        type: 'expense'
      }
    }) || 0;
    
    // Lucro/Prejuízo
    const profit = totalIncome - totalExpense;
    
    // Retorno sobre investimento (ROI)
    const roi = totalExpense > 0 ? (profit / totalExpense) * 100 : 0;
    
    // Receita média por inscrito
    const revenuePerSubscriber = channel.subscribers > 0 ? totalIncome / channel.subscribers : 0;
    
    return res.status(200).send({
      channelId: channel.id,
      name: channel.name,
      type: channel.type,
      totalIncome,
      totalExpense,
      profit,
      roi,
      subscribers: channel.subscribers,
      monthlyViews: channel.monthlyViews,
      engagementRate: channel.engagementRate,
      revenuePerSubscriber
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
