'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: (models) => {
        Todo.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        })
      }
    }
  });
  return Todo;
};