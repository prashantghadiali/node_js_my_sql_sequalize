module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles', 
                key: 'id'
            }
        }
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.Role, { foreignKey: 'roleId' });
    };

    return Customer;
};
