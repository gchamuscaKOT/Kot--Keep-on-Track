
const db = require("../models");
const Task = db.task;
const Channel = db.channel;

// Criar nova tarefa
exports.create = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.userId
    });
    
    return res.status(201).send(task);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter todas as tarefas do usuário
exports.findAll = async (req, res) => {
  try {
    const { status, priority, channelId, dueDate } = req.query;
    const where = { userId: req.userId };
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (channelId) {
      where.channelId = channelId;
    }
    
    if (dueDate) {
      where.dueDate = {
        [db.Sequelize.Op.lte]: new Date(dueDate)
      };
    }
    
    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['id', 'name', 'type']
        }
      ],
      order: [
        ['dueDate', 'ASC'],
        ['priority', 'DESC']
      ]
    });
    
    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Obter uma tarefa específica
exports.findOne = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['id', 'name', 'type']
        }
      ]
    });
    
    if (!task) {
      return res.status(404).send({ message: "Tarefa não encontrada." });
    }
    
    return res.status(200).send(task);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar uma tarefa
exports.update = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).send({ message: "Tarefa não encontrada." });
    }
    
    await task.update(req.body);
    
    return res.status(200).send({
      message: "Tarefa atualizada com sucesso!",
      task
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Excluir uma tarefa
exports.delete = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).send({ message: "Tarefa não encontrada." });
    }
    
    await task.destroy();
    
    return res.status(200).send({ message: "Tarefa excluída com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Atualizar status de uma tarefa
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).send({ message: "Status não informado." });
    }
    
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).send({ message: "Tarefa não encontrada." });
    }
    
    await task.update({ status });
    
    return res.status(200).send({
      message: "Status da tarefa atualizado com sucesso!",
      task
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
