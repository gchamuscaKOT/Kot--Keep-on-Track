
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Task.belongsTo(models.Channel, {
      foreignKey: 'channelId',
      onDelete: 'SET NULL'
    });
  };

  return Task;
};
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    dueDate: {
      type: DataTypes.DATE
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
    Task.belongsTo(models.channel, {
      foreignKey: 'channelId',
      as: 'channel',
      allowNull: true
    });
  };

  return Task;
};
