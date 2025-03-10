
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'creator', 'manager'),
      defaultValue: 'creator'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Transaction, {
      foreignKey: 'userId',
      as: 'transactions'
    });
    User.hasMany(models.Channel, {
      foreignKey: 'userId',
      as: 'channels'
    });
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks'
    });
  };

  return User;
};
