module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }, {
      timestamps: true,
    });
  
    Role.associate = (models) => {
      Role.belongsToMany(models.User, { through: 'UserRole', foreignKey: 'roleId' });
    };
  
    return Role;
  };
  