
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
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    profileImage: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  User.associate = (models) => {
    User.hasMany(models.transaction, {
      foreignKey: 'userId',
      as: 'transactions'
    });
    User.hasMany(models.channel, {
      foreignKey: 'userId',
      as: 'channels'
    });
    User.hasMany(models.task, {
      foreignKey: 'userId',
      as: 'tasks'
    });
  };

  return User;
};
