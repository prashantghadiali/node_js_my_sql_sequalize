const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const sequelize = require("../config/database")
const UserModel = require('./user');
const RoleModel = require("./role");
const UserRoleModel = require("./userRole");
const SupplierModel = require("./supplier");
const CustomerModel = require("./customer");
  

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const User = UserModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);
const UserRole = UserRoleModel(sequelize, Sequelize);
const Supplier = SupplierModel(sequelize, Sequelize);
const Customer = CustomerModel(sequelize, Sequelize);

module.exports = {
    User,
    Role,
    UserRole,
    Supplier,
    Customer,
    sequelize, 
  };

module.exports = db;