
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#007bff'
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.Transaction, {
      foreignKey: 'categoryId',
      as: 'transactions'
    });
    Category.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Category;
};
