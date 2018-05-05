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
    status: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending'
    }
  })

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: 'OwnerId',
      onDelete: 'CASCADE'
    })
  }

  return Todo
};