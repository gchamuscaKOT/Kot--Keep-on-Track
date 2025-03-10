
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform: {
      type: DataTypes.ENUM('youtube', 'instagram', 'tiktok', 'twitch', 'twitter', 'facebook', 'other'),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscribers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    isMonetized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Channel.associate = (models) => {
    Channel.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Channel.hasMany(models.Transaction, {
      foreignKey: 'channelId',
      as: 'transactions'
    });
  };

  return Channel;
};
