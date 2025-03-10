
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurrenceFrequency: {
      type: DataTypes.ENUM('none', 'daily', 'weekly', 'monthly', 'yearly'),
      defaultValue: 'none'
    },
    channelId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Transaction.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      onDelete: 'SET NULL'
    });
    Transaction.belongsTo(models.Channel, {
      foreignKey: 'channelId',
      onDelete: 'SET NULL'
    });
  };

  return Transaction;
};
