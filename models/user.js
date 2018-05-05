import bCrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RoleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCreate: (theUser) => {
        theUser.password = bCrypt.hashSync(theUser.password,
          bCrypt.genSaltSync(8));
      },
      beforeUpdate: (theUser) => {
        theUser.password = bCrypt.hashSync(theUser.password,
          bCrypt.genSaltSync(8));
      }
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'RoleId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Todo, {
      foreignKey: 'OwnerId'
    });
  }
  return User;
};