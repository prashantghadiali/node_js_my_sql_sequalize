const { hashPassword } = require("../utils/auth");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          notEmpty: true
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          notEmpty: true
        }
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 100] 
        }
      },
      hobbies: {
        type: DataTypes.STRING, 
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['male', 'female', 'other']] 
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active' 
      }
    }, {
      timestamps: true,
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await hashPassword(user.password);
        }
      },
      scopes: {
        withoutPassword: {
          attributes: { exclude: ['password'] }
        }
      }
    });

    User.associate = (models) => {
      User.belongsToMany(models.Role, { through: 'UserRole', foreignKey: 'userId' });
    };
  
    return User;
  };
  