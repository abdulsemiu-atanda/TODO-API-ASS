module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    }
  })

  Role.associate = (models) => {
    Role.hasMany(models.User)
  }

  return Role;
};
