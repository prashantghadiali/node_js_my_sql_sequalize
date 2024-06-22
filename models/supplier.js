module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
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
        products: {
            type: DataTypes.STRING,
            allowNull: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles', // Name of the referenced table
                key: 'id'      // Primary key of the referenced table
            }
        }
    });

    Supplier.associate = (models) => {
        Supplier.belongsTo(models.Role, { foreignKey: 'roleId' });
    };

    return Supplier;
};
